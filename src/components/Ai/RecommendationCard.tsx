import type Coin from '../../Models/Coins'
import type { AiRecommendation } from '../../services/aiRecommendationService'
// Assuming you have a CSS file for this, or you can use your existing classes
import './Ai.css' 

interface RecommendationCardProps {
    coin: Coin
    recommendation?: AiRecommendation // The '?' is crucial here! It tells TypeScript this might be undefined.
    loading: boolean
    onRecommend: (coin: Coin) => void
}

export default function RecommendationCard({
    coin,
    recommendation,
    loading,
    onRecommend,
}: RecommendationCardProps) {
    
    // Determine a CSS class based on the Hebrew decision text
    const getDecisionClass = (decision: string) => {
        return decision === 'buy' ? 'decision-good' : 'decision-bad'
    }

    return (
        <div className="recommendation-card">
            <div className="recommendation-card-header">
                <h3>
                    {coin.name} <span>({coin.symbol.toUpperCase()})</span>
                </h3>
            </div>

            <div className="recommendation-card-content">
                {/* STATE 1: Data is currently loading */}
                {loading && (
                    <div className="loading-state">
                        <p>Analyzing market data for {coin.name}...</p>
                    </div>
                )}

                {/* STATE 2: Data has successfully loaded */}
                {!loading && recommendation && (
                    <div className="result-state">
                        <div className={`decision-badge ${getDecisionClass(recommendation.decision)}`}>
                            {recommendation.decision}
                        </div>
                        <p className="explanation-text">{recommendation.explanation}</p>
                        <button 
                            type="button" 
                            className="re-analyze-button"
                            onClick={() => onRecommend(coin)}
                        >
                            Refresh Analysis
                        </button>
                    </div>
                )}

                {/* STATE 3: No data has been fetched yet */}
                {!loading && !recommendation && (
                    <div className="empty-state">
                        <p>No analysis generated yet.</p>
                        <button 
                            type="button" 
                            onClick={() => onRecommend(coin)}
                        >
                            Get Recommendation
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}