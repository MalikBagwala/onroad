// import { useAuth } from '@/authentication/AuthContext';
// import {
//   Add_Update_ContributionMutation,
//   Contribution_Price_Items_Constraint,
//   Contribution_Price_Items_Update_Column,
//   Contributions_Constraint,
//   Contributions_Update_Column,
//   Order_By,
//   Price_ItemsQuery,
// } from '@/gql/graphql';
// import { REFRESH_TOKEN } from '@/graphql/auth.gql';
// import { ADD_UPDATE_CONTRIBUTION, PRICE_ITEMS } from '@/graphql/contribution.gql';
// import convertToInr from '@/utils/convertToInr';
// import { setAccessToken } from '@/utils/tokens';
// import {
//   ActionIcon,
//   Box,
//   Button,
//   Divider,
//   Flex,
//   NumberInput,
//   Select,
//   Stack,
//   Text,
// } from '@mantine/core';
// import { useForm } from '@mantine/form';
// import { modals } from '@mantine/modals';
// import { notifications } from '@mantine/notifications';
// import { IconMinus, IconPlus, IconTrash } from '@tabler/icons-react';
// import { useEffect } from 'react';
// import ConfettiExplosion from 'react-confetti-explosion';
// import { useClient, useMutation, useQuery } from 'urql';
// import UserOnboardWrapper from '../UserOnboard/UserOnboardWrapper';
// import { useNavigate } from 'react-router-dom';
// type AddUpdatePricingType = {
//   contribution: Add_Update_ContributionMutation['insert_contributions_one'];
// };

// type FormState = {
//   total: number;
//   priceBreakup: {
//     id?: string;
//     item: Price_ItemsQuery['price_items'][0];
//     value: number | undefined;
//   }[];
// };

// const AddUpdatePricing = ({ contribution }: AddUpdatePricingType) => {
//   const [{ fetching, data: cData }, addUpdateContribution] = useMutation(ADD_UPDATE_CONTRIBUTION);

//   useEffect(() => {
//     if (!form?.values?.priceBreakup?.length && pData?.price_items?.length) {
//       form.setFieldValue(
//         'priceBreakup',
//         pData.price_items.map((item) => ({ item, value: undefined }))
//       );
//     }
//   }, [pData]);

//   return (
//     <form
//       onSubmit={form.onSubmit(async (values) => {
//         const { data, error } = await addUpdateContribution({
//           object: {
//             id: contribution?.id,
//             quoted_on: contribution?.quoted_on,
//             dealership_name: contribution?.dealership_name,
//             city_id: contribution?.city?.id,
//             variant_id: contribution?.variant?.id,

//           },
//           on_conflict: {
//             constraint: Contributions_Constraint.ContributionsPkey,
//             update_columns: [Contributions_Update_Column.VariantId],
//           },
//         });
//         if (error || !data?.insert_contributions_one) {
//           notifications.show({
//             title: 'Error',
//             message: 'Something went wrong',
//             color: 'red',
//           });
//         } else {
//           notifications.show({
//             title: 'Your Contribution has been added',
//             message: 'Thank you for helping people make smarter decisions! 🧠💡',
//             color: 'green',
//           });
//         }
//       })}
//     ></form>
//   );
// };

// export default AddUpdatePricing;
