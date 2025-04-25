import { renderHook, act } from "@testing-library/react";
import { useCheckoutData } from "@/hooks/useCheckoutData";

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Interface correspondant à celle définie dans le hook
interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
}

interface CheckoutData {
  shippingAddress: Address | null;
  billingAddress: Address | null;
  sameAsBilling: boolean;
  paymentMethod: string | null;
  orderId: string | null;
  orderTotal: number;
}

describe("useCheckoutData", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  it("devrait initialiser avec des données par défaut", () => {
    const { result } = renderHook(() => useCheckoutData());

    expect(result.current.checkoutData).toEqual({
      shippingAddress: null,
      billingAddress: null,
      sameAsBilling: true,
      paymentMethod: null,
      orderId: null,
      orderTotal: 0,
    });
  });

  it("devrait charger les données depuis localStorage au montage", () => {
    const testData: CheckoutData = {
      shippingAddress: {
        firstName: "John",
        lastName: "Doe",
        street: "123 Main St",
        city: "Paris",
        postalCode: "75001",
        country: "France",
        phone: "+33123456789",
      },
      billingAddress: null,
      sameAsBilling: true,
      paymentMethod: null,
      orderId: null,
      orderTotal: 0,
    };

    mockLocalStorage.setItem("checkoutData", JSON.stringify(testData));

    const { result } = renderHook(() => useCheckoutData());

    expect(result.current.checkoutData).toEqual(testData);
  });

  it("devrait mettre à jour les données et sauvegarder dans localStorage", () => {
    const { result } = renderHook(() => useCheckoutData());

    const newData: Partial<CheckoutData> = {
      paymentMethod: "lightning",
      orderTotal: 1000,
    };

    act(() => {
      result.current.updateCheckoutData(newData);
    });

    expect(result.current.checkoutData.paymentMethod).toBe("lightning");
    expect(result.current.checkoutData.orderTotal).toBe(1000);

    const savedData = JSON.parse(
      mockLocalStorage.getItem("checkoutData") || "{}"
    );
    expect(savedData.paymentMethod).toBe("lightning");
    expect(savedData.orderTotal).toBe(1000);
  });

  it("devrait réinitialiser les données et supprimer de localStorage", () => {
    const testData: CheckoutData = {
      shippingAddress: {
        firstName: "John",
        lastName: "Doe",
        street: "123 Main St",
        city: "Paris",
        postalCode: "75001",
        country: "France",
      },
      billingAddress: null,
      sameAsBilling: true,
      paymentMethod: "lightning",
      orderId: "order_123",
      orderTotal: 1500,
    };

    mockLocalStorage.setItem("checkoutData", JSON.stringify(testData));

    const { result } = renderHook(() => useCheckoutData());

    act(() => {
      result.current.resetCheckoutData();
    });

    expect(result.current.checkoutData).toEqual({
      shippingAddress: null,
      billingAddress: null,
      sameAsBilling: true,
      paymentMethod: null,
      orderId: null,
      orderTotal: 0,
    });
    expect(mockLocalStorage.getItem("checkoutData")).toBeNull();
  });
});
