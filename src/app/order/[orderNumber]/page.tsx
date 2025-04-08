import OrderStatus from "../../../components/OrderStatus";

interface OrderPageProps {
  params: {
    orderNumber: string;
  };
}

export default function OrderPage({ params }: OrderPageProps) {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <OrderStatus orderNumber={params.orderNumber} />
      </div>
    </main>
  );
}
