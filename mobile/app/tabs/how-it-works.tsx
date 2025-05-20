import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, Server, ArrowRight } from 'lucide-react';

const AccordionItem = ({ title, content }: { title: string; content: string }): React.ReactElement => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="mb-3 border border-gray-200 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition"
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        <span className="text-base font-semibold text-gray-900 flex-1 pr-2">{title}</span>
        {expanded ? <ChevronUp size={20} className="text-gray-900" /> : <ChevronDown size={20} className="text-gray-900" />}
      </button>
      {expanded && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-700 text-base leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  );
};

export default function HowItWorksScreen(): React.ReactElement {
  return (
    <div className="bg-white min-h-screen">
      <section className="p-5 bg-[#0F3B82]">
        <h1 className="text-3xl font-bold text-white mb-2">How DazBox Works</h1>
        <p className="text-base text-white/90 leading-6">Understanding Lightning Nodes and how you can benefit</p>
      </section>

      <img
        src="https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt="Lightning Network"
        className="w-full h-[200px] object-cover"
      />

      <section className="p-5 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">What is the Lightning Network?</h2>
        <p className="text-[15px] text-gray-800 leading-6 mb-4">
          The Lightning Network is a "Layer 2" payment protocol that operates on top of Bitcoin. 
          It enables instant, low-cost transactions between participating nodes, addressing the 
          scalability limitations of the Bitcoin blockchain.
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start">
            <Zap size={28} className="text-orange-500 mb-2" />
            <div className="text-lg font-semibold mb-1">Fast Payments</div>
            <div className="text-gray-700 text-base">
              Transactions are settled instantly, unlike regular Bitcoin transactions that can take minutes or hours.
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start">
            <Server size={28} className="text-orange-500 mb-2" />
            <div className="text-lg font-semibold mb-1">Micro-Transactions</div>
            <div className="text-gray-700 text-base">
              Enables payments as small as a fraction of a cent, opening up new use cases.
            </div>
          </div>
        </div>
      </section>

      <section className="p-5 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">What is a Lightning Node?</h2>
        <p className="text-[15px] text-gray-800 leading-6 mb-4">
          A Lightning Node is a computer that runs the Lightning Network protocol software.
          It connects to other nodes to form a network of payment channels, allowing for
          off-chain Bitcoin transactions.
        </p>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">How a Node Operator Earns Fees:</h3>
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold">1</span>
              <div>
                <div className="font-semibold">Open Payment Channels</div>
                <div className="text-gray-700 text-base">Fund and establish payment channels with other Lightning nodes</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold">2</span>
              <div>
                <div className="font-semibold">Route Payments</div>
                <div className="text-gray-700 text-base">Your node helps route payments through the network</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold">3</span>
              <div>
                <div className="font-semibold">Collect Fees</div>
                <div className="text-gray-700 text-base">Earn routing fees for each payment that passes through your node</div>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="p-5 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">How DazBox Makes It Easy</h2>
        <img
          src="https://images.pexels.com/photos/3912981/pexels-photo-3912981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="DazBox"
          className="w-full h-[180px] object-cover rounded-xl mb-4"
        />
        <p className="text-[15px] text-gray-800 leading-6 mb-4">
          DazBox is a plug-and-play device that lets anyone run a Lightning Node without technical expertise:
        </p>
        <div className="space-y-4">
          <div>
            <div className="font-semibold">1. Plug in DazBox</div>
            <div className="text-gray-700 text-base">Connect power and internet to your DazBox</div>
          </div>
          <div>
            <div className="font-semibold">2. Fund Your Channels</div>
            <div className="text-gray-700 text-base">Send Bitcoin to your node to establish payment channels</div>
          </div>
          <div>
            <div className="font-semibold">3. Let Dazia Optimize</div>
            <div className="text-gray-700 text-base">Our AI automatically configures your node for optimal routing</div>
          </div>
          <div>
            <div className="font-semibold">4. Earn Commissions</div>
            <div className="text-gray-700 text-base">Start earning fees as payments route through your node</div>
          </div>
        </div>
      </section>

      <section className="p-5">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
        <AccordionItem 
          title="How much can I earn with a Lightning Node?"
          content="Earnings vary based on your node's liquidity, channel connections, and network activity. While some operators earn just a few dollars monthly, well-connected nodes with strategic channel placements can earn significantly more. Dazia AI helps optimize your setup for maximum profitability."
        />
        <AccordionItem 
          title="Do I need technical knowledge?"
          content="No! DazBox is designed for non-technical users. Our plug-and-play approach and Dazia AI handle all the technical configurations and optimizations automatically."
        />
        <AccordionItem 
          title="How much Bitcoin do I need to start?"
          content="You can start with as little as 0.01 BTC (~$500 at current prices), but nodes with more liquidity (0.05-0.1 BTC or more) tend to attract more routes and earn higher fees."
        />
        <AccordionItem 
          title="Is running a Lightning Node risky?"
          content="DazBox includes enterprise-grade security features to protect your funds. However, like any financial service, there are some risks. We recommend starting with a smaller amount until you're comfortable with the system."
        />
      </section>

      <div className="flex justify-center my-8">
        <a
          href="/checkout/dazbox"
          className="flex flex-row items-center bg-orange-500 text-white font-semibold py-4 px-8 rounded-full shadow-lg gap-2 text-lg hover:bg-orange-600 transition"
        >
          Get Your DazBox
          <ArrowRight size={18} />
        </a>
      </div>
    </div>
  );
}