import { useParams } from 'react-router-dom';

type VariantDetailType = {};
const VariantDetail = ({}: VariantDetailType) => {
  const { id } = useParams();
  return <div>Variant {id}</div>;
};

export default VariantDetail;
