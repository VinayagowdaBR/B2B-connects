import {
    Navbar,
    HeroSearch,
    CategoryGrid,
    FeaturedBusinesses,
    ProductsGrid,
    StatsCounter,
    HowItWorks,
    CTABanner,
    Footer,
} from '@/components/landing';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <Navbar />

            {/* Hero Section with Search */}
            <HeroSearch />

            {/* Category Grid */}
            <CategoryGrid />

            {/* Featured Businesses */}
            <FeaturedBusinesses />

            {/* How It Works */}
            <HowItWorks />

            {/* Latest Products */}
            <ProductsGrid />

            {/* Stats Counter */}
            <StatsCounter />

            {/* CTA Banner */}
            <CTABanner />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;
