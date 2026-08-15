import {ProductDetails} from "./ProductDetails"
import RequestModal from "./RequestModal"
import AnimatedSection from "../ui/AnimatedSection";

export const ProductPage = () => {
    return (<>
    <AnimatedSection>
    <ProductDetails />
    </AnimatedSection>
    <RequestModal />
    
    </>)
}