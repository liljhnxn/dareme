import { expect } from "chai";
import hre from "hardhat";
import { DareMe } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

const { ethers } = hre;

describe("DareMe Contract", function () {
  let dareMe: DareMe;
  let owner: HardhatEthersSigner;
  let participant: HardhatEthersSigner;
  let stranger: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, participant, stranger] = await ethers.getSigners();
    const DareMeFactory = await ethers.getContractFactory("DareMe");
    dareMe = (await DareMeFactory.deploy()) as unknown as DareMe;
    await dareMe.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should initialize with zero dares", async function () {
      expect(await dareMe.getDareCount()).to.equal(0n);
    });
  });

  describe("Creating a Dare", function () {
    it("should create a valid dare and emit DareCreated event", async function () {
      const tx = await dareMe.createDare(
        "Do 10 push-ups",
        "Record yourself or do 10 push-ups on camera right now!",
        "Fitness"
      );

      await expect(tx)
        .to.emit(dareMe, "DareCreated")
        .withArgs(1n, owner.address, "Do 10 push-ups", "Fitness", (val: bigint) => val > 0n);

      expect(await dareMe.getDareCount()).to.equal(1n);

      const dare = await dareMe.getDare(1n);
      expect(dare.id).to.equal(1n);
      expect(dare.creator).to.equal(owner.address);
      expect(dare.participant).to.equal(ethers.ZeroAddress);
      expect(dare.title).to.equal("Do 10 push-ups");
      expect(dare.description).to.equal("Record yourself or do 10 push-ups on camera right now!");
      expect(dare.category).to.equal("Fitness");
      expect(dare.status).to.equal(0); // Status.OPEN
      expect(dare.createdAt).to.be.gt(0);
      expect(dare.completedAt).to.equal(0);
    });

    it("should default empty category to 'Fun'", async function () {
      await dareMe.createDare("Riddle me this", "What has to be broken before you can use it?", "");
      const dare = await dareMe.getDare(1n);
      expect(dare.category).to.equal("Fun");
    });

    it("should reject empty title", async function () {
      await expect(
        dareMe.createDare("", "Some description", "Fun")
      ).to.be.revertedWithCustomError(dareMe, "EmptyTitle");
    });

    it("should reject oversized title (> 100 characters)", async function () {
      const longTitle = "A".repeat(101);
      await expect(
        dareMe.createDare(longTitle, "Valid description", "Fun")
      ).to.be.revertedWithCustomError(dareMe, "TitleTooLong");
    });

    it("should reject empty description", async function () {
      await expect(
        dareMe.createDare("Valid Title", "", "Fun")
      ).to.be.revertedWithCustomError(dareMe, "EmptyDescription");
    });

    it("should reject oversized description (> 500 characters)", async function () {
      const longDesc = "B".repeat(501);
      await expect(
        dareMe.createDare("Valid Title", longDesc, "Fun")
      ).to.be.revertedWithCustomError(dareMe, "DescriptionTooLong");
    });

    it("should reject invalid category", async function () {
      await expect(
        dareMe.createDare("Valid Title", "Valid description", "InvalidCategoryXYZ")
      ).to.be.revertedWithCustomError(dareMe, "InvalidCategory");
    });
  });

  describe("Accepting a Dare", function () {
    beforeEach(async function () {
      await dareMe.createDare("Code challenge", "Solve Fibonacci in 5 lines", "Knowledge");
    });

    it("should allow another user to accept an open dare and emit DareAccepted", async function () {
      const tx = await dareMe.connect(participant).acceptDare(1n);

      await expect(tx)
        .to.emit(dareMe, "DareAccepted")
        .withArgs(1n, participant.address, (val: bigint) => val > 0n);

      const dare = await dareMe.getDare(1n);
      expect(dare.participant).to.equal(participant.address);
      expect(dare.status).to.equal(1); // Status.IN_PROGRESS
    });

    it("should prevent creator from accepting their own dare", async function () {
      await expect(
        dareMe.connect(owner).acceptDare(1n)
      ).to.be.revertedWithCustomError(dareMe, "CreatorCannotAccept");
    });

    it("should prevent accepting a dare that is already accepted (multiple participants)", async function () {
      await dareMe.connect(participant).acceptDare(1n);

      await expect(
        dareMe.connect(stranger).acceptDare(1n)
      ).to.be.revertedWithCustomError(dareMe, "DareNotOpen");
    });

    it("should revert if dare ID does not exist", async function () {
      await expect(
        dareMe.connect(participant).acceptDare(999n)
      ).to.be.revertedWithCustomError(dareMe, "DareNotFound");
    });
  });

  describe("Completing a Dare", function () {
    beforeEach(async function () {
      await dareMe.createDare("Gaming challenge", "Win a match without healing", "Gaming");
      await dareMe.connect(participant).acceptDare(1n);
    });

    it("should allow assigned participant to mark dare as completed and emit DareCompleted", async function () {
      const tx = await dareMe.connect(participant).completeDare(1n);

      await expect(tx)
        .to.emit(dareMe, "DareCompleted")
        .withArgs(1n, participant.address, (val: bigint) => val > 0n);

      const dare = await dareMe.getDare(1n);
      expect(dare.status).to.equal(2); // Status.COMPLETED
      expect(dare.completedAt).to.be.gt(0);
    });

    it("should prevent non-participant from completing the dare", async function () {
      await expect(
        dareMe.connect(owner).completeDare(1n)
      ).to.be.revertedWithCustomError(dareMe, "OnlyParticipantCanComplete");

      await expect(
        dareMe.connect(stranger).completeDare(1n)
      ).to.be.revertedWithCustomError(dareMe, "OnlyParticipantCanComplete");
    });

    it("should prevent duplicate completion", async function () {
      await dareMe.connect(participant).completeDare(1n);

      await expect(
        dareMe.connect(participant).completeDare(1n)
      ).to.be.revertedWithCustomError(dareMe, "DareNotInProgress");
    });

    it("should prevent completing an unaccepted dare", async function () {
      await dareMe.createDare("Another challenge", "Do something fun", "Fun");
      await expect(
        dareMe.connect(participant).completeDare(2n)
      ).to.be.revertedWithCustomError(dareMe, "DareNotInProgress");
    });
  });

  describe("Querying all dares", function () {
    it("should return all dares correctly via getAllDares", async function () {
      await dareMe.createDare("Dare 1", "Desc 1", "Fun");
      await dareMe.createDare("Dare 2", "Desc 2", "Fitness");
      await dareMe.createDare("Dare 3", "Desc 3", "Gaming");

      const all = await dareMe.getAllDares();
      expect(all.length).to.equal(3);
      expect(all[0].title).to.equal("Dare 1");
      expect(all[1].title).to.equal("Dare 2");
      expect(all[2].title).to.equal("Dare 3");
    });
  });
});
