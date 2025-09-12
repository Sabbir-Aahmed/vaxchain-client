
import  { useEffect, useState } from "react";
import { Navigation } from "swiper/modules";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import ErrorAlert from "./ErrorAlert";
import CampaignCard from "./CampaignCard";
import apiClient from "../../Services/apiClient";


const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    apiClient
      .get("/campaigns/")
      .then((res) => setCampaigns(res.data.results))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
      
  }, []);
  return (
    <section className=" bg-gray-50">
        <div className="px-2 py-12 max-w-7xl mx-auto">
            <div className="flex justify-between items-center px-4 md:px-8 mb-8">
                <h2 className="text-3xl text-balance md:text-4xl font-bold">Campaigns</h2>
                <a href="#" className="btn bg-teal-500 text-white px-6 py-6 rounded-full text-lg">View All</a>
            </div>

            {/* loading spinner */}
            {isLoading && (
                <div className="flex justify-center items-center py-10">
                    <span className="loading loading-spinner text-secondary loading-xl "></span>
                </div>
            )}

            {/* error alert  */}
            {error && <ErrorAlert error={error}/>}

            {/* Product slider */}
            {!isLoading && !error && campaigns.length > 0 &&(
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={10}
                    slidesPerView={1}
                    navigation
                    breakpoints={{
                        640: {slidesPerView: 2},
                        1024: {slidesPerView: 3},
                    }}
                    className="mt-4 px-4 container"
                    >
                    {campaigns.map((campaign) => (
                        <SwiperSlide key={campaign.id} className="flex justify-center">
                        <CampaignCard key={campaign.key} campaign={campaign} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            {!isLoading && !error && campaigns.length === 0 &&(
                <p className="text-center text-gray-500 mt-6">No Campaigns Available</p>
            )}
        </div>
    </section>
  );
};

export default Campaigns;
