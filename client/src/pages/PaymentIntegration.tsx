import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Check, 
  X, 
  Star, 
  Crown, 
  Zap, 
  Shield, 
  Users, 
  BookOpen, 
  Code, 
  Headphones, 
  Infinity,
  Calendar,
  Gift,
  Percent,
  Clock,
  Award,
  TrendingUp,
  Heart,
  Lock
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  originalPrice?: number;
  features: string[];
  limitations?: string[];
  popular?: boolean;
  icon: any;
  color: string;
  description: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export function PaymentIntegration() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedPlan, setSelectedPlan] = useState<string>('pro-monthly');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    country: 'US',
    zipCode: ''
  });

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      billingCycle: 'monthly',
      features: [
        'Access to basic courses',
        'Community forums',
        'Basic coding problems',
        '5 sandbox projects',
        'Email support'
      ],
      limitations: [
        'Limited to 10 hours/month',
        'No advanced features',
        'Community support only'
      ],
      icon: BookOpen,
      color: 'text-gray-500',
      description: 'Perfect for getting started with coding'
    },
    {
      id: 'pro-monthly',
      name: 'Pro',
      price: billingCycle === 'monthly' ? 19.99 : 199.99,
      originalPrice: billingCycle === 'yearly' ? 239.88 : undefined,
      billingCycle,
      features: [
        'All Free features',
        'Unlimited learning hours',
        'Premium courses & tutorials',
        'Advanced coding challenges',
        'Unlimited sandbox projects',
        'AI-powered code reviews',
        'Priority email support',
        'Downloadable resources',
        'Progress analytics'
      ],
      popular: true,
      icon: Star,
      color: 'text-blue-500',
      description: 'Best for serious learners and professionals'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 49.99 : 499.99,
      originalPrice: billingCycle === 'yearly' ? 599.88 : undefined,
      billingCycle,
      features: [
        'All Pro features',
        'Team management dashboard',
        '1-on-1 mentoring sessions',
        'Custom learning paths',
        'White-label solutions',
        'Advanced analytics',
        'Dedicated account manager',
        '24/7 phone support',
        'Custom integrations',
        'Compliance & security features'
      ],
      icon: Crown,
      color: 'text-purple-500',
      description: 'Perfect for teams and organizations'
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2026,
      isDefault: true
    },
    {
      id: '2',
      type: 'card',
      last4: '1234',
      brand: 'Mastercard',
      expiryMonth: 8,
      expiryYear: 2025,
      isDefault: false
    }
  ];

  const currentPlan = plans.find(p => p.id === 'free'); // Simulate current plan

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    if (planId !== 'free') {
      setShowPaymentForm(true);
    }
  };

  const processPayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Successful!",
        description: `You've successfully upgraded to ${plans.find(p => p.id === selectedPlan)?.name} plan.`,
      });
      
      setShowPaymentForm(false);
      setIsProcessing(false);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const getSavingsPercentage = (originalPrice: number, currentPrice: number) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Choose Your Learning Journey</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Unlock premium features and accelerate your coding career with our comprehensive learning platform
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4">
          <span className={billingCycle === 'monthly' ? 'font-semibold' : 'text-muted-foreground'}>
            Monthly
          </span>
          <Button
            variant="outline"
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative"
          >
            <div className={`w-12 h-6 rounded-full transition-colors ${
              billingCycle === 'yearly' ? 'bg-primary' : 'bg-muted'
            }`}>
              <div className={`w-5 h-5 rounded-full bg-white transition-transform transform ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0.5'
              } mt-0.5`} />
            </div>
          </Button>
          <span className={billingCycle === 'yearly' ? 'font-semibold' : 'text-muted-foreground'}>
            Yearly
          </span>
          {billingCycle === 'yearly' && (
            <Badge className="bg-green-100 text-green-800">Save 20%</Badge>
          )}
        </div>
      </div>

      {/* Current Plan Status */}
      {currentPlan && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <currentPlan.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Current Plan: {currentPlan.name}</h3>
                  <p className="text-muted-foreground">
                    {currentPlan.price === 0 ? 'Free forever' : `$${currentPlan.price}/month`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge>Active</Badge>
                <Button variant="outline">Manage Plan</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Plans */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${
            plan.popular ? 'ring-2 ring-primary shadow-lg scale-105' : ''
          } ${selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-3 py-1">
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto p-3 bg-muted rounded-full w-fit">
                <plan.icon className={`h-8 w-8 ${plan.color}`} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline justify-center space-x-2">
                  <span className="text-4xl font-bold">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  )}
                </div>
                {plan.originalPrice && (
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm text-muted-foreground line-through">
                      ${plan.originalPrice}
                    </span>
                    <Badge className="bg-green-100 text-green-800">
                      Save {getSavingsPercentage(plan.originalPrice, plan.price)}%
                    </Badge>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
                {plan.limitations?.map((limitation, index) => (
                  <li key={index} className="flex items-center space-x-3 opacity-60">
                    <X className="h-5 w-5 text-red-500" />
                    <span className="text-sm">{limitation}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full"
                variant={plan.id === currentPlan?.id ? 'outline' : 'default'}
                disabled={plan.id === currentPlan?.id}
                onClick={() => handleUpgrade(plan.id)}
              >
                {plan.id === currentPlan?.id ? 'Current Plan' : 
                 plan.price === 0 ? 'Get Started' : 'Upgrade Now'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Complete Your Upgrade</span>
            </CardTitle>
            <div className="flex items-center justify-between">
              <span>Plan: {plans.find(p => p.id === selectedPlan)?.name}</span>
              <span className="font-bold">
                ${plans.find(p => p.id === selectedPlan)?.price}/{billingCycle === 'monthly' ? 'mo' : 'yr'}
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={paymentData.expiryDate}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={paymentData.cvv}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="name">Cardholder Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={paymentData.name}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={paymentData.country}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, country: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    placeholder="12345"
                    value={paymentData.zipCode}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, zipCode: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowPaymentForm(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={processPayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : (
                  `Pay $${plans.find(p => p.id === selectedPlan)?.price}`
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
          <p className="text-muted-foreground">
            See what's included with each plan
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4">Features</th>
                  <th className="text-center py-4">Free</th>
                  <th className="text-center py-4">Pro</th>
                  <th className="text-center py-4">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { feature: 'Basic Courses', free: true, pro: true, enterprise: true },
                  { feature: 'Community Access', free: true, pro: true, enterprise: true },
                  { feature: 'Premium Courses', free: false, pro: true, enterprise: true },
                  { feature: 'AI Code Reviews', free: false, pro: true, enterprise: true },
                  { feature: 'Unlimited Projects', free: false, pro: true, enterprise: true },
                  { feature: '1-on-1 Mentoring', free: false, pro: false, enterprise: true },
                  { feature: 'Team Management', free: false, pro: false, enterprise: true },
                  { feature: 'Custom Integrations', free: false, pro: false, enterprise: true }
                ].map((row, index) => (
                  <tr key={index}>
                    <td className="py-4 font-medium">{row.feature}</td>
                    <td className="text-center py-4">
                      {row.free ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-red-500 mx-auto" />}
                    </td>
                    <td className="text-center py-4">
                      {row.pro ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-red-500 mx-auto" />}
                    </td>
                    <td className="text-center py-4">
                      {row.enterprise ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-red-500 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            {
              q: "Can I change my plan anytime?",
              a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for Enterprise plans."
            },
            {
              q: "Is there a free trial for paid plans?",
              a: "Yes! All paid plans come with a 14-day free trial. No credit card required to start."
            },
            {
              q: "Can I cancel my subscription?",
              a: "Absolutely. You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your billing period."
            }
          ].map((faq, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-semibold">{faq.q}</h4>
              <p className="text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}