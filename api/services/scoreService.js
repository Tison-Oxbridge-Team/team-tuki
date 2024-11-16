const Score = require('../models/Score');

/**
 * Aggregates scores for startups.
 * @returns {Array} - Aggregated scores.
 */
async function calculateAggregateScores() {
    try {
        const scores = await Score.aggregate([
            {
                $group: {
                    _id: { startupId: '$startupId', roundId: '$roundId' },
                    averageProblemScore: { $avg: '$problemScore' },
                    averageSolutionScore: { $avg: '$solutionScore' },
                    averageInnovationScore: { $avg: '$innovationScore' },
                    averageTeamScore: { $avg: '$teamScore' },
                    averageBusinessModelScore: { $avg: '$businessModelScore' },
                    averageMarketOpportunityScore: { $avg: '$marketOpportunityScore' },
                    averageTechnicalFeasibilityScore: { $avg: '$technicalFeasibilityScore' },
                    averageExecutionStrategyScore: { $avg: '$executionStrategyScore' },
                    averagePitchQualityScore: { $avg: '$pitchQualityScore' },
                    totalNominations: { $sum: { $cond: ['$nominated', 1, 0] } },
                },
            },
        ]);

        return scores.map((score) => ({
            startupId: score._id.startupId,
            roundId: score._id.roundId,
            averageScores: {
                problem: score.averageProblemScore,
                solution: score.averageSolutionScore,
                innovation: score.averageInnovationScore,
                team: score.averageTeamScore,
                businessModel: score.averageBusinessModelScore,
                marketOpportunity: score.averageMarketOpportunityScore,
                technicalFeasibility: score.averageTechnicalFeasibilityScore,
                executionStrategy: score.averageExecutionStrategyScore,
                pitchQuality: score.averagePitchQualityScore,
            },
            totalNominations: score.totalNominations,
        }));
    } catch (err) {
        console.error('Error aggregating scores:', err);
        throw new Error('Failed to aggregate scores');
    }
}

module.exports = { calculateAggregateScores };
