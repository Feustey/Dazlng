import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Check, CreditCard, Truck, Lock, X } from 'lucide-react-native';

const DAZBOX_PRICE = 299;
const DAZBOX_PRO_PRICE = 499;

type ProductVariant = 'standard' | 'pro';

export default function BuyScreen() {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>('standard');
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    streetAddress: '',
    aptSuite: '',
    city: '',
    postalCode: '',
    country: ''
  });
  
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  
  const currentPrice = selectedVariant === 'standard' ? DAZBOX_PRICE : DAZBOX_PRO_PRICE;
  const subtotal = currentPrice * quantity;
  const shipping = 15;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    // Validation basique
    if (!formData.fullName || !formData.email || !formData.streetAddress || !formData.city || !formData.postalCode || !formData.country) {
      Alert.alert(
        "Erreur de formulaire",
        "Veuillez remplir tous les champs obligatoires",
        [{ text: "OK" }]
      );
      return;
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert(
        "Email invalide",
        "Veuillez entrer une adresse email valide",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Confirmation de commande",
      `Voulez-vous confirmer votre commande pour ${quantity} DazBox ${selectedVariant === 'pro' ? 'Pro' : 'Standard'} ?`,
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Confirmer",
          onPress: () => {
            // Ici, vous pouvez ajouter la logique pour traiter le paiement
            Alert.alert(
              "Commande confirmée",
              "Merci pour votre commande ! Vous recevrez un email de confirmation.",
              [{ text: "OK" }]
            );
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Purchase DazBox</Text>
        <Text style={styles.headerSubtitle}>
          Select your model and complete your purchase
        </Text>
      </View>

      <View style={styles.productSection}>
        <View style={styles.productVariants}>
          <TouchableOpacity 
            style={[
              styles.variantCard, 
              selectedVariant === 'standard' && styles.variantCardSelected
            ]}
            onPress={() => setSelectedVariant('standard')}
          >
            <Image
              source={{ uri: 'https://images.pexels.com/photos/3912422/pexels-photo-3912422.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
              style={styles.variantImage}
              resizeMode="cover"
            />
            <View style={styles.variantInfo}>
              <Text style={styles.variantName}>DazBox Standard</Text>
              <Text style={styles.variantPrice}>${DAZBOX_PRICE}</Text>
              <View style={styles.variantFeatures}>
                <View style={styles.featureItem}>
                  <Check size={16} color="#F7931A" />
                  <Text style={styles.featureText}>4GB RAM</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check size={16} color="#F7931A" />
                  <Text style={styles.featureText}>128GB SSD</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check size={16} color="#F7931A" />
                  <Text style={styles.featureText}>Basic Dazia AI</Text>
                </View>
              </View>
            </View>
            {selectedVariant === 'standard' && (
              <View style={styles.selectedBadge}>
                <Check size={20} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.variantCard, 
              selectedVariant === 'pro' && styles.variantCardSelected
            ]}
            onPress={() => setSelectedVariant('pro')}
          >
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/3913020/pexels-photo-3913020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
              style={styles.variantImage}
              resizeMode="cover"
            />
            <View style={styles.variantInfo}>
              <Text style={styles.variantName}>DazBox Pro</Text>
              <Text style={styles.variantPrice}>${DAZBOX_PRO_PRICE}</Text>
              <View style={styles.variantFeatures}>
                <View style={styles.featureItem}>
                  <Check size={16} color="#F7931A" />
                  <Text style={styles.featureText}>8GB RAM</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check size={16} color="#F7931A" />
                  <Text style={styles.featureText}>256GB SSD</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check size={16} color="#F7931A" />
                  <Text style={styles.featureText}>Advanced Dazia AI</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check size={16} color="#F7931A" />
                  <Text style={styles.featureText}>Premium Support</Text>
                </View>
              </View>
            </View>
            {selectedVariant === 'pro' && (
              <View style={styles.selectedBadge}>
                <Check size={20} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Quantity:</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
              <X size={20} color="#444444" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.orderSummary}>
          <Text style={styles.orderSummaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryDivider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>

          <View style={styles.paymentOptions}>
            <Text style={styles.paymentTitle}>Payment Methods</Text>
            
            <View style={styles.paymentMethod}>
              <CreditCard size={20} color="#111111" />
              <Text style={styles.paymentMethodText}>Credit/Debit Card</Text>
            </View>
            
            <View style={styles.paymentMethod}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/5980743/pexels-photo-5980743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
                style={styles.bitcoinIcon} 
              />
              <Text style={styles.paymentMethodText}>Bitcoin</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.shippingSection}>
        <Text style={styles.sectionTitle}>Shipping Information</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Full Name</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter your full name"
            placeholderTextColor="#999999"
            value={formData.fullName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Email Address</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter your email address"
            keyboardType="email-address"
            placeholderTextColor="#999999"
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          />
        </View>
        
        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 2, marginRight: 10 }]}>
            <Text style={styles.formLabel}>Street Address</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter street address"
              placeholderTextColor="#999999"
              value={formData.streetAddress}
              onChangeText={(text) => setFormData(prev => ({ ...prev, streetAddress: text }))}
            />
          </View>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.formLabel}>Apt/Suite</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Optional"
              placeholderTextColor="#999999"
              value={formData.aptSuite}
              onChangeText={(text) => setFormData(prev => ({ ...prev, aptSuite: text }))}
            />
          </View>
        </View>
        
        <View style={styles.formRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.formLabel}>City</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter city"
              placeholderTextColor="#999999"
              value={formData.city}
              onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
            />
          </View>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.formLabel}>Postal Code</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter postal code"
              placeholderTextColor="#999999"
              value={formData.postalCode}
              onChangeText={(text) => setFormData(prev => ({ ...prev, postalCode: text }))}
            />
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Country</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter country"
            placeholderTextColor="#999999"
            value={formData.country}
            onChangeText={(text) => setFormData(prev => ({ ...prev, country: text }))}
          />
        </View>
      </View>

      <View style={styles.securityNote}>
        <Lock size={20} color="#111111" />
        <Text style={styles.securityText}>
          Your personal information is encrypted and secure. We never store your payment details.
        </Text>
      </View>

      <View style={styles.shippingNote}>
        <Truck size={20} color="#111111" />
        <Text style={styles.shippingText}>
          Free shipping on orders over $500. Estimated delivery: 5-7 business days.
        </Text>
      </View>

      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Proceed to Payment</Text>
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
  productSection: {
    padding: 20,
  },
  productVariants: {
    marginBottom: 24,
  },
  variantCard: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  variantCardSelected: {
    borderColor: '#F7931A',
    borderWidth: 2,
  },
  variantImage: {
    width: '100%',
    height: 120,
  },
  variantInfo: {
    padding: 16,
  },
  variantName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 5,
  },
  variantPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F7931A',
    marginBottom: 10,
  },
  variantFeatures: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#444444',
  },
  selectedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#F7931A',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#0F3B82',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  proBadgeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444444',
  },
  quantityText: {
    width: 40,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  orderSummary: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  orderSummaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#444444',
  },
  summaryValue: {
    fontSize: 14,
    color: '#111111',
    fontWeight: '500',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F7931A',
  },
  paymentOptions: {
    marginTop: 16,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 10,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  paymentMethodText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#111111',
  },
  bitcoinIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  shippingSection: {
    padding: 20,
    borderTopWidth: 8,
    borderTopColor: '#F5F5F5',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111111',
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111111',
  },
  formRow: {
    flexDirection: 'row',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 10,
  },
  securityText: {
    fontSize: 13,
    color: '#444444',
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  shippingNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 16,
  },
  shippingText: {
    fontSize: 13,
    color: '#444444',
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  checkoutButton: {
    backgroundColor: '#F7931A',
    paddingVertical: 16,
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 40,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});