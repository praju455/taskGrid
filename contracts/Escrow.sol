// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Draft escrow contract for Polygon (PoS/zkEVM compatible)
// Not wired into the app yet. To be deployed later.

contract TaskGridEscrow {
    enum JobStatus { Pending, InProgress, Submitted, Approved, Disputed, Resolved, Refunded }

    struct Job {
        address client;
        address freelancer;
        uint256 amountWei;
        JobStatus status;
    }

    mapping(bytes32 => Job) public jobs; // jobId => Job

    event EscrowCreated(bytes32 indexed jobId, address indexed client, uint256 amountWei);
    event JobStarted(bytes32 indexed jobId, address indexed freelancer);
    event WorkSubmitted(bytes32 indexed jobId);
    event PaymentReleased(bytes32 indexed jobId, address indexed freelancer, uint256 amountWei);
    event DisputeOpened(bytes32 indexed jobId);
    event DisputeResolved(bytes32 indexed jobId, address winner);
    event Refunded(bytes32 indexed jobId, address client, uint256 amountWei);

    modifier onlyClient(bytes32 jobId) {
        require(msg.sender == jobs[jobId].client, "Only client");
        _;
    }

    modifier onlyClientOrFreelancer(bytes32 jobId) {
        require(msg.sender == jobs[jobId].client || msg.sender == jobs[jobId].freelancer, "Not participant");
        _;
    }

    function createEscrow(bytes32 jobId) external payable {
        require(jobs[jobId].client == address(0), "Exists");
        require(msg.value > 0, "No funds");
        jobs[jobId] = Job({
            client: msg.sender,
            freelancer: address(0),
            amountWei: msg.value,
            status: JobStatus.Pending
        });
        emit EscrowCreated(jobId, msg.sender, msg.value);
    }

    function startJob(bytes32 jobId, address freelancer) external onlyClient(jobId) {
        Job storage j = jobs[jobId];
        require(j.status == JobStatus.Pending, "Bad state");
        j.freelancer = freelancer;
        j.status = JobStatus.InProgress;
        emit JobStarted(jobId, freelancer);
    }

    function submitWork(bytes32 jobId) external onlyClientOrFreelancer(jobId) {
        Job storage j = jobs[jobId];
        require(j.status == JobStatus.InProgress, "Bad state");
        j.status = JobStatus.Submitted;
        emit WorkSubmitted(jobId);
    }

    function approveAndRelease(bytes32 jobId) external onlyClient(jobId) {
        Job storage j = jobs[jobId];
        require(j.status == JobStatus.Submitted, "Bad state");
        j.status = JobStatus.Approved;
        (bool ok, ) = j.freelancer.call{value: j.amountWei}("");
        require(ok, "Transfer failed");
        emit PaymentReleased(jobId, j.freelancer, j.amountWei);
        delete jobs[jobId];
    }

    function openDispute(bytes32 jobId) external onlyClientOrFreelancer(jobId) {
        Job storage j = jobs[jobId];
        require(j.status == JobStatus.Submitted || j.status == JobStatus.InProgress, "Bad state");
        j.status = JobStatus.Disputed;
        emit DisputeOpened(jobId);
    }

    // Placeholder resolution: client wins => refund; freelancer wins => release
    function resolveDispute(bytes32 jobId, bool freelancerWins) external {
        // In production, restrict to arbitrator/DAO
        Job storage j = jobs[jobId];
        require(j.status == JobStatus.Disputed, "Bad state");
        if (freelancerWins) {
          j.status = JobStatus.Resolved;
          (bool ok, ) = j.freelancer.call{value: j.amountWei}("");
          require(ok, "Transfer failed");
          emit DisputeResolved(jobId, j.freelancer);
        } else {
          j.status = JobStatus.Refunded;
          (bool ok2, ) = j.client.call{value: j.amountWei}("");
          require(ok2, "Refund failed");
          emit Refunded(jobId, j.client, j.amountWei);
        }
        delete jobs[jobId];
    }
}


