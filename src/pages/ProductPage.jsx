import {ProductDetails} from "../Layout/ProductPage/ProductDetails"
import RequestModal from "../Layout/ProductPage/ProductRequestModal"
import AnimatedSection from "../components/ui/AnimatedSection";

export const ProductPage = () => {
    return (<>
    <AnimatedSection>
    <ProductDetails />
    </AnimatedSection>
    <RequestModal />
    
    </>)
}