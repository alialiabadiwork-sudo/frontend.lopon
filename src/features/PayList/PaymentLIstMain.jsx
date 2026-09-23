
import useGet from "@hooks/server/useGet";
import Skeleton from './components/Skeleton';
import MainPayList from './MainPayList';

function PaymentListMain() {
  const { data: payList, isLoading, isError, refetch } = useGet({}, 'payments/my', 'payments/my_Get');

  if (isLoading) return <Skeleton />;
 
  return <MainPayList payList={payList} />;
}

export default PaymentListMain;