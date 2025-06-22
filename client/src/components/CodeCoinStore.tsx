import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ShieldCheck, Lock, Loader2 } from 'lucide-react';
import { User, StoreItem } from '@/types';
import api from '@/lib/api';

interface ResourceCardProps {
  item: StoreItem;
  user: User | null;
  unlockedItems: string[];
  onUnlock: (item: StoreItem) => void;
}

function ResourceCard({ item, user, unlockedItems, onUnlock }: ResourceCardProps) {
  const isUnlocked = unlockedItems.includes(item.id);
  const canAfford = user ? (user.codeCoins || 0) >= item.price : false;

  return (
    <Card className="flex flex-col">
      <CardContent className="p-6 flex-1 flex flex-col">
        <h3 className="font-semibold mb-2">{item.title}</h3>
        <p className="text-sm text-muted-foreground flex-1">{item.description}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center font-bold text-yellow-500">
            <img src="/coin.svg" alt="CodeCoin" className="h-5 w-5 mr-1" />
            {item.price}
          </div>
          {isUnlocked ? (
            <div className="flex items-center text-sm font-semibold text-green-500">
              <ShieldCheck className="h-4 w-4 mr-1" />
              Unlocked
            </div>
          ) : (
            <Button size="sm" onClick={() => onUnlock(item)} disabled={!canAfford || !user}>
              <Lock className="h-4 w-4 mr-1" />
              Unlock
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function CodeCoinStore() {
  const { user, updateUser } = useAuth();
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemsRes, unlockedRes] = await Promise.all([
          api.get('/store/items'),
          api.get('/user/unlocked-items')
        ]);
        setStoreItems(itemsRes.data);
        setUnlockedItems(unlockedRes.data);
      } catch (err) {
        setError('Failed to load store data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUnlockClick = (item: StoreItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedItem || !user) return;

    try {
      const res = await api.post('/store/unlock', { itemId: selectedItem.id });
      const { updatedUser, unlockedItemId } = res.data;
      
      updateUser(updatedUser);
      setUnlockedItems([...unlockedItems, unlockedItemId]);
      
      setIsModalOpen(false);
      setSelectedItem(null);
    } catch(err) {
        setError('Purchase failed. Please check your balance and try again.');
        console.error(err);
        // Optionally close modal or show error within it
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">CodeCoin Store</h1>
        <p className="text-muted-foreground mt-2">Use your earned CodeCoins to unlock exclusive content.</p>
        <div className="inline-flex items-center justify-center mt-4 bg-card border rounded-full px-4 py-2">
          Your Balance: 
          <span className="flex items-center font-bold text-yellow-500 ml-2">
            <img src="/coin.svg" alt="CodeCoin" className="h-5 w-5 mr-1" />
            {user?.codeCoins || 0}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {storeItems.map(item => (
          <ResourceCard key={item.id} item={item} user={user} unlockedItems={unlockedItems} onUnlock={handleUnlockClick} />
        ))}
      </div>

      {selectedItem && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Unlock</DialogTitle>
              <DialogDescription>
                You are about to unlock "{selectedItem.title}". This will be deducted from your CodeCoin balance.
              </DialogDescription>
            </DialogHeader>
            <div className="my-4 space-y-2">
              <div className="flex justify-between"><span>Item Cost:</span> <span className="font-semibold text-yellow-500">{selectedItem.price} Coins</span></div>
              <div className="flex justify-between"><span>Your Balance:</span> <span className="font-semibold">{user?.codeCoins || 0} Coins</span></div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold"><span>Remaining Balance:</span> <span>{(user?.codeCoins || 0) - selectedItem.price} Coins</span></div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleConfirmPurchase}>Confirm & Unlock</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
