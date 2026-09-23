import React from 'react'
import Card from '@components/UI/Card';
import moment from 'moment-jalaali';
import { twMerge } from 'tailwind-merge';

const Row = ({ title, value, className }) => {
  return (
    <div className={twMerge("flex justify-start pt-3 pb-3  border-b items-center", className)} key={Math.random() * 100}>
      <p className="text-md font-kal-2 text-slate-400 w-1/4 font-bold flex-grow-0 mt-1"> {title}</p>
      <p className="text-md font-kal-2  flex-grow-0"> {value}</p>
    </div>
  )
}
const StatePayment = ({ state }) => {
  if (state == "success") {
    return <div className="alert alert-success  w-max p-2 px-3 mt-0 text-sm text-white">
      پرداخت موفق
    </div>
  }

  if (state == "inProgress") {
    return <div className="alert alert-info  w-max p-2 px-3 mt-0 text-sm text-white">
      درحال پرداخت
    </div>
  }
  if (state == "cancel") {
    return <div className="alert alert-error  w-max p-2 px-3 mt-0 text-sm text-white">
      پرداخت ناموفق
    </div>
  }

}


function PayItem({ data }) {
  function reverseString(str = '') {
    if(str == ''){
      return "یافت نشد"
    }
    return str.split('').reverse().join('');
  }
  const jalaliDate = moment(data.date).locale('fa').format('HH:mm:ss - jYYYY/jMM/jDD');
  return (
    <Card classCard={` border-2 px-1 py-0  ${data.paymentState == "inProgress" && 'hidden'}`} classBody="gap-0 pt-0 pb-3" >
      <Row title={"تاریخ"} value={jalaliDate} />
      <Row title={"عنوان"} value={data.description} />
      <Row title={"مبلغ"} value={data.amount.toLocaleString('fa-IR', { style: 'decimal', }) + " ریال "} />
      <Row title={"وضعیت"} value={<StatePayment state={data.paymentState} />} />
      <Row title={"کارت"} value={reverseString(data.card_pan)} />
      {data.preferredVisitDate && (
        <Row
          title={"زمان مراجعه"}
          value={`${data.preferredVisitDate} ${data.preferredVisitTimeRange ? `(${data.preferredVisitTimeRange === 'NO_PREFERENCE' ? 'فرقی ندارد' : data.preferredVisitTimeRange.replace('-', ' تا ')})` : ''}`}
        />
      )}
      <Row title={"پیگیری"} value={data._id} className="border-b-0"/>
    </Card>
  )
}

export default PayItem