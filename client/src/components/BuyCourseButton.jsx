import React, { useEffect } from 'react';
import { Button } from './ui/button';
import { useCreateCheckoutSessionMutation } from '@/features/api/purchaseApi';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const BuyCourseButton = ({ courseId }) => {

  const [createCheckoutSession, {data, isLoading, isSuccess,isError,error }] = useCreateCheckoutSessionMutation();

  const purchaseCourseHandler = async () => {
    try {
      const res = await createCheckoutSession({ courseId }).unwrap();
      if (res?.url) {
        window.location.href = res.url; // redirect to Stripe checkout
      }
    } catch (error) {
      console.error("Failed to initiate checkout:", error);
       toast.error(error?.data?.message || "Failed to update course");
    }
  };


  useEffect(() => {
    if(isSuccess){
       if(data?.url){
        // Redirect to stripe
        window.location.href=data.url;   
       }else{
        toast.error("Invalide response from server")
       }
    }
    if(isError){
      toast.error(error?.data?.message || "Failed to checkout")
    }
  }, [data,isSuccess,isError,error])
  

  return (
    <Button onClick={purchaseCourseHandler} className="w-full" disabled={isLoading}>
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing...
        </span>
      ) : (
        "Purchase Course"
      )}
    </Button>
  );
};

export default BuyCourseButton;
