import { useState, useEffect } from 'react'
import { useAppSelector } from '../../services/redux/hooks'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import graphService from '../../services/graphsService'
import type Graph from '../../Models/Graph'
import './Graphs.css'

interface ChartItem {
    name: string;
    price: number;
}

export default function Graphs() {
    const selectedCoins = useAppSelector(state => state.buttonSwitchSlice.selectedCoins)
    const [liveData, setLiveData] = useState<Graph | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        if (selectedCoins.length === 0) {
            return
        }

        const symbolsString = selectedCoins.map(coin => coin.symbol).join(',')

        const getPrices = async (showLoading: boolean) => {
            if (showLoading) setIsLoading(true)
            try {
                const data = await graphService.graph(symbolsString)
                setLiveData(data);
                setIsLoading(false);
            } catch (e) {
                alert(e)
            }
        }

        getPrices(true)

        const intervalId = setInterval(() => getPrices(false), 1000)


        return () => clearInterval(intervalId);

    }, [selectedCoins]);


    const chartData: ChartItem[] = liveData
        ? Object.keys(liveData).map(symbol => ({
            name: symbol.toUpperCase(),
            price: liveData[symbol].USD
        }))
        : []

    return (
        <div className="graphs-container">
            <h2 className="graphs-title">Real-Time Crypto Report (USD)</h2>

            {selectedCoins.length === 0 ? (
                <div className="no-coins-msg">
                    <p>No coins selected. Please go to Home and select up to 5 coins.</p>
                </div>
            ) : isLoading && !liveData ? (
                <div className="loader">Updating live data...</div>
            ) : (
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#ccc"
                                tick={{ fill: '#ccc' }}
                            />
                            <YAxis
                                stroke="#ccc"
                                tick={{ fill: '#ccc' }}
                                tickFormatter={(value) => `$${value.toLocaleString()}`}
                            />
                            <div className='Tooltip'>
                                <Tooltip
                                    itemStyle={{ color: '#82ca9d' }}
                                    formatter={(value: number | string | readonly (number | string)[] | undefined) => {
                                        if (typeof value === 'number') {
                                            return [`$${value.toLocaleString()}`, 'Price']
                                        }
                                        return [`$${String(value)}`, 'Price']
                                    }}
                                />
                            </div>
                            <Legend />
                            <Bar
                                dataKey="price"
                                fill="#82ca9d"
                                name="Price in USD"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}