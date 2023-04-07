import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFundOverviewWithHistory } from "../api";
import { FundOverviewWithHistoryResponse } from "../@types";

export default function useFundDetails(timeRange: string) {
  const { id } = useParams();
  const [fund, setFund] = useState<FundOverviewWithHistoryResponse>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getFundOverviewWithHistory(id, timeRange)
        .then((res) => setFund(res))
        .catch((err) => {
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  return { fund, loading };
}
