import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp, Zap, Server, ArrowRight } from 'lucide-react-native';

type AccordionItemProps = {
  title: string;
  content: string;
};

const AccordionItem = ({ title, content }: AccordionItemProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity 
        style={styles.accordionHeader} 
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.accordionTitle}>{title}</Text>
        {expanded ? (
          <ChevronUp size={20} color="#111111" />
        ) : (
          <ChevronDown size={20} color="#111111" />
        )}
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.accordionContent}>
          <Text style={styles.accordionText}>{content}</Text>
        </View>
      )}
    </View>
  );
};

export default function HowItWorksScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>How DazBox Works</Text>
        <Text style={styles.headerSubtitle}>
          Understanding Lightning Nodes and how you can benefit
        </Text>
      </View>

      <Image
        source={{ uri: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
        style={styles.heroImage}
        resizeMode="cover"
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What is the Lightning Network?</Text>
        <Text style={styles.sectionText}>
          The Lightning Network is a "Layer 2" payment protocol that operates on top of Bitcoin. 
          It enables instant, low-cost transactions between participating nodes, addressing the 
          scalability limitations of the Bitcoin blockchain.
        </Text>
        
        <View style={styles.lightningFeatures}>
          <View style={styles.featureCard}>
            <Zap size={28} color="#F7931A" />
            <Text style={styles.featureCardTitle}>Fast Payments</Text>
            <Text style={styles.featureCardText}>
              Transactions are settled instantly, unlike regular Bitcoin transactions that can take minutes or hours.
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <Server size={28} color="#F7931A" />
            <Text style={styles.featureCardTitle}>Micro-Transactions</Text>
            <Text style={styles.featureCardText}>
              Enables payments as small as a fraction of a cent, opening up new use cases.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What is a Lightning Node?</Text>
        <Text style={styles.sectionText}>
          A Lightning Node is a computer that runs the Lightning Network protocol software.
          It connects to other nodes to form a network of payment channels, allowing for
          off-chain Bitcoin transactions.
        </Text>
        
        <Text style={styles.stepTitle}>How a Node Operator Earns Fees:</Text>
        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepContentTitle}>Open Payment Channels</Text>
              <Text style={styles.stepContentText}>
                Fund and establish payment channels with other Lightning nodes
              </Text>
            </View>
          </View>
          
          <View style={styles.stepLine} />
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepContentTitle}>Route Payments</Text>
              <Text style={styles.stepContentText}>
                Your node helps route payments through the network
              </Text>
            </View>
          </View>
          
          <View style={styles.stepLine} />
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepContentTitle}>Collect Fees</Text>
              <Text style={styles.stepContentText}>
                Earn routing fees for each payment that passes through your node
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.dazboxSection}>
        <Text style={styles.sectionTitle}>How DazBox Makes It Easy</Text>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/3912981/pexels-photo-3912981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
          style={styles.dazboxImage}
          resizeMode="cover"
        />
        <Text style={styles.sectionText}>
          DazBox is a plug-and-play device that lets anyone run a Lightning Node without technical expertise:
        </Text>
        
        <View style={styles.simpleSteps}>
          <View style={styles.simpleStep}>
            <Text style={styles.simpleStepTitle}>1. Plug in DazBox</Text>
            <Text style={styles.simpleStepText}>
              Connect power and internet to your DazBox
            </Text>
          </View>
          
          <View style={styles.simpleStep}>
            <Text style={styles.simpleStepTitle}>2. Fund Your Channels</Text>
            <Text style={styles.simpleStepText}>
              Send Bitcoin to your node to establish payment channels
            </Text>
          </View>
          
          <View style={styles.simpleStep}>
            <Text style={styles.simpleStepTitle}>3. Let Dazia Optimize</Text>
            <Text style={styles.simpleStepText}>
              Our AI automatically configures your node for optimal routing
            </Text>
          </View>
          
          <View style={styles.simpleStep}>
            <Text style={styles.simpleStepTitle}>4. Earn Commissions</Text>
            <Text style={styles.simpleStepText}>
              Start earning fees as payments route through your node
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.faqSection}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        
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
      </View>

      <TouchableOpacity style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>Get Your DazBox</Text>
        <ArrowRight size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    backgroundColor: '#0F3B82',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 22,
  },
  heroImage: {
    width: '100%',
    height: 200,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
    marginBottom: 16,
  },
  lightningFeatures: {
    marginTop: 16,
  },
  featureCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  featureCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111111',
    marginTop: 10,
    marginBottom: 6,
  },
  featureCardText: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111111',
    marginTop: 24,
    marginBottom: 16,
  },
  stepsContainer: {
    marginTop: 5,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F7931A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  stepContent: {
    flex: 1,
  },
  stepContentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 4,
  },
  stepContentText: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 20,
  },
  stepLine: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E5E5',
    marginLeft: 15,
    marginBottom: 10,
  },
  dazboxSection: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  dazboxImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  simpleSteps: {
    marginTop: 10,
  },
  simpleStep: {
    marginBottom: 16,
  },
  simpleStepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 5,
  },
  simpleStepText: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 20,
  },
  faqSection: {
    padding: 20,
  },
  accordionItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  accordionHeader: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    flex: 1,
    paddingRight: 10,
  },
  accordionContent: {
    padding: 15,
    backgroundColor: '#F9F9F9',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  accordionText: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 22,
  },
  ctaButton: {
    flexDirection: 'row',
    backgroundColor: '#F7931A',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});