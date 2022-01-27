import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import { isDarkAtom } from "../atom";
import { useRecoilValue } from "recoil";


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

interface ChartProps{
    coinId:string;
}

function Chart({coinId}:ChartProps){
    const isDark = useRecoilValue(isDarkAtom)
    const {isLoading,data}=useQuery<IHistorical[]>(["ohlcv",coinId],()=>fetchCoinHistory(coinId));

    return <div>
        {isLoading?
            "Loading Chart..."
        :
            <ApexChart 
                type="candlestick"
                series={[
                    {
                        name:"price",
                        data:data?.map(a=>{
                            const time = a.time_open
                            const yData = [a.open.toFixed(3),a.high.toFixed(3),a.low.toFixed(3),a.close.toFixed(3)]
                            return(
                                {
                                    x:time,
                                    y:yData
                                }
                            )
                        })
                    }
                ]}
                options={{
                    chart:{
                        type:"candlestick",
                        height:350
                    },
                    theme:{
                        mode:isDark?"dark":"light"
                    },
                   tooltip:{
                        enabled:true,
                        intersect:false,
                   },
                   xaxis:{
                       type:"datetime"
                   },
                   yaxis:{
                       show:true,
                       decimalsInFloat: 3,
                       labels:{
                           show:true
                       }
                   }
                }}
            />
        }
    </div>
}

export default Chart;