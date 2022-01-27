import { useQuery } from "react-query";
import { fetchCoinHistory, fetchCoinTickers } from "../api";

interface ChartProps{
    coinId:string;
}
interface IHistorical{
    time_open: string;
    time_close: string;
    open:number;
    high: number;
    low:number;
    close: number;
    volume:number;
    market_cap:number;
}

function Price({coinId}:ChartProps){
    const {isLoading,data}=useQuery<IHistorical[]>(["ohlcv",coinId],()=>fetchCoinHistory(coinId));
    return (
    <div>
        {
            isLoading?
            <span>"Loading Price"</span>
            :
            <div>
                {data?.reverse().map(a=>{
                    return(
                        <>
                            <span>{a.time_close.slice(0,10)+"  close"}</span>
                            <br/>
                            <span>{a.close}</span>
                            <hr/>
                        </>
                    )
                })}
            </div>
        }
    </div>
    )
}

export default Price;