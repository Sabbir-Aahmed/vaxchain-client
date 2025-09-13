
import CampaignCard from './CampaignCard';
import ErrorAlert from './ErrorAlert';

const CampaignList = ({campaigns, loading, error}) => {

    if (loading)
        return(
            <div className="flex justify-center items-center py-10 min-h-screen">
                <span className="loading loading-spinner text-secondary loading-xl "></span>
            </div>
        )
            
    if (error)
        return (
            <ErrorAlert error={error}/>
        )

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 '>
            {campaigns.map((campaign) => (
                <CampaignCard campaign={campaign} key={campaign.id}/>
            ))}
        </div>
    );
};

export default CampaignList;