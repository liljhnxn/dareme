// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title DareMe
 * @notice Drop a dare. Take the challenge. Simple Web3 challenge dApp.
 */
contract DareMe {
    enum Status {
        OPEN,
        IN_PROGRESS,
        COMPLETED
    }

    struct Dare {
        uint256 id;
        address creator;
        address participant;
        string title;
        string description;
        string category;
        uint256 createdAt;
        uint256 completedAt;
        Status status;
    }

    // Limits for gas efficiency and spam prevention
    uint256 public constant MAX_TITLE_LENGTH = 100;
    uint256 public constant MAX_DESCRIPTION_LENGTH = 500;
    uint256 public constant MAX_CATEGORY_LENGTH = 32;

    uint256 private _dareCount;
    mapping(uint256 => Dare) private _dares;

    // Events
    event DareCreated(
        uint256 indexed dareId,
        address indexed creator,
        string title,
        string category,
        uint256 createdAt
    );

    event DareAccepted(
        uint256 indexed dareId,
        address indexed participant,
        uint256 acceptedAt
    );

    event DareCompleted(
        uint256 indexed dareId,
        address indexed participant,
        uint256 completedAt
    );

    // Custom errors
    error EmptyTitle();
    error TitleTooLong();
    error EmptyDescription();
    error DescriptionTooLong();
    error CategoryTooLong();
    error InvalidCategory();
    error DareNotFound();
    error DareNotOpen();
    error CreatorCannotAccept();
    error DareNotInProgress();
    error OnlyParticipantCanComplete();

    /**
     * @notice Creates a new dare challenge
     * @param title Short title of the challenge
     * @param description Brief description of what must be done
     * @param category Challenge category (Fun, Knowledge, Gaming, Fitness)
     * @return dareId The newly generated dare ID
     */
    function createDare(
        string calldata title,
        string calldata description,
        string calldata category
    ) external returns (uint256) {
        bytes memory titleBytes = bytes(title);
        bytes memory descBytes = bytes(description);
        bytes memory catBytes = bytes(category);

        if (titleBytes.length == 0) revert EmptyTitle();
        if (titleBytes.length > MAX_TITLE_LENGTH) revert TitleTooLong();
        if (descBytes.length == 0) revert EmptyDescription();
        if (descBytes.length > MAX_DESCRIPTION_LENGTH) revert DescriptionTooLong();
        if (catBytes.length > MAX_CATEGORY_LENGTH) revert CategoryTooLong();

        string memory finalCategory = category;
        if (catBytes.length == 0) {
            finalCategory = "Fun";
        } else {
            bytes32 catHash = keccak256(catBytes);
            if (
                catHash != keccak256(bytes("Fun")) &&
                catHash != keccak256(bytes("Knowledge")) &&
                catHash != keccak256(bytes("Gaming")) &&
                catHash != keccak256(bytes("Fitness"))
            ) {
                revert InvalidCategory();
            }
        }

        uint256 newId = ++_dareCount;
        _dares[newId] = Dare({
            id: newId,
            creator: msg.sender,
            participant: address(0),
            title: title,
            description: description,
            category: finalCategory,
            createdAt: block.timestamp,
            completedAt: 0,
            status: Status.OPEN
        });

        emit DareCreated(newId, msg.sender, title, finalCategory, block.timestamp);
        return newId;
    }

    /**
     * @notice Accept an open dare. Creator cannot accept own dare.
     * @param dareId The dare ID to accept
     */
    function acceptDare(uint256 dareId) external {
        if (dareId == 0 || dareId > _dareCount) revert DareNotFound();
        Dare storage dare = _dares[dareId];

        if (dare.status != Status.OPEN) revert DareNotOpen();
        if (dare.creator == msg.sender) revert CreatorCannotAccept();

        dare.participant = msg.sender;
        dare.status = Status.IN_PROGRESS;

        emit DareAccepted(dareId, msg.sender, block.timestamp);
    }

    /**
     * @notice Complete a dare. Can only be invoked by the assigned participant.
     * @param dareId The dare ID to complete
     */
    function completeDare(uint256 dareId) external {
        if (dareId == 0 || dareId > _dareCount) revert DareNotFound();
        Dare storage dare = _dares[dareId];

        if (dare.status != Status.IN_PROGRESS) revert DareNotInProgress();
        if (dare.participant != msg.sender) revert OnlyParticipantCanComplete();

        dare.status = Status.COMPLETED;
        dare.completedAt = block.timestamp;

        emit DareCompleted(dareId, msg.sender, block.timestamp);
    }

    /**
     * @notice Returns dare information for a given ID
     * @param dareId The dare ID
     */
    function getDare(uint256 dareId) external view returns (Dare memory) {
        if (dareId == 0 || dareId > _dareCount) revert DareNotFound();
        return _dares[dareId];
    }

    /**
     * @notice Returns total number of dares created
     */
    function getDareCount() external view returns (uint256) {
        return _dareCount;
    }

    /**
     * @notice Helper to fetch all dares in a single call
     */
    function getAllDares() external view returns (Dare[] memory) {
        Dare[] memory all = new Dare[](_dareCount);
        for (uint256 i = 1; i <= _dareCount; i++) {
            all[i - 1] = _dares[i];
        }
        return all;
    }
}

