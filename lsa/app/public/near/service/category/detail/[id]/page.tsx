'use client'

import DetailPage from "./detailpage";
import { useParams } from 'next/navigation'

export default function ServiceDetail() {
  const params = useParams();

  return (
    <div>
      <DetailPage params={params} />
    </div>
  );
}