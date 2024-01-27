import { Contributions_Constraint, Contributions_Update_Column } from '@/gql/graphql';
import { ADD_UPDATE_CONTRIBUTION } from '@/graphql/contribution.gql';
import { VARIANT_COLORS } from '@/graphql/variant.gql';
import { Alert, Button, Stack, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconDatabase } from '@tabler/icons-react';
import { useState } from 'react';
import { useMutation } from 'urql';
import CitySelector from '../NewUser/CitySelector';
import QuerySelect from '../QuerySelect/QuerySelect';
import UserOnboardWrapper from '../UserOnboard/UserOnboardWrapper';
import VariantSelector from '../VariantSelector/VariantSelector';
import AddUpdatePricing from './AddUpdatePricing';
import { useCurrentUser } from '@/authentication/AuthContext';

type AddUpdateContributionType = {};

const INITIAL_STATE = {
  variant: '7965067e-dac3-4b60-ba6b-9b8c7e719c72',
  color: 'b3932082-b474-46f6-be1a-275ed5e263ac',
  city: '713b7600-4c05-48fc-86d1-31974c747ce3',
  quotedAt: new Date('2022-02-26T11:53:07.840Z'),
  dealership: 'Anutek Engineering',
  remark: 'Good Experience',
};
const AddUpdateContribution = ({}: AddUpdateContributionType) => {
  const { data: uData } = useCurrentUser();
  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const form = useForm({
    initialValues: {
      variant: null,
      color: null,
      city: uData?.city?.id,
      quotedAt: new Date(),
      dealership: null,
      remark: null,
      ...(INITIAL_STATE as any),
    },
    validate: {},
  });
  const [{ fetching, data }, addUpdateContribution] = useMutation(ADD_UPDATE_CONTRIBUTION);

  if (activeStep === 2 && data?.insert_contributions_one)
    return <AddUpdatePricing contribution={data.insert_contributions_one} />;

  console.log(form.values);
  return (
    <UserOnboardWrapper
      title={'Your anonymous contribution will help people make smarter decisions! 🧠💡'}
    >
      <form
        onSubmit={form.onSubmit(async (values) => {
          const { data, error } = await addUpdateContribution({
            object: {
              variant_id: values.variant,
              color_id: values.color,
              city_id: values.city,
              quoted_on: values.quotedAt?.toISOString()?.split('T')[0],
              dealership_name: values.dealership,
              remark: values.remark,
            },
            on_conflict: {
              constraint: Contributions_Constraint.ContributionsPkey,
              update_columns: [
                Contributions_Update_Column.VariantId,
                Contributions_Update_Column.ColorId,
                Contributions_Update_Column.CityId,
                Contributions_Update_Column.QuotedOn,
                Contributions_Update_Column.DealershipName,
                Contributions_Update_Column.Remark,
              ],
            },
          });
          if (data?.insert_contributions_one?.id) {
            setActiveStep(2);
          } else {
            notifications.show({
              title: 'Error',
              message: error?.message,
              color: 'red',
            });
          }
        })}
      >
        <Stack mt={'xs'}>
          <Alert p={'xs'} variant="light" color="blue" icon={<IconDatabase />}>
            This contribution is completely anomyous, we will <strong>NEVER</strong> share your
            personal information with anyone
          </Alert>
          <VariantSelector
            required
            {...form.getInputProps('variant')}
            label="Vehicle Variant"
            placeholder="Variant"
          />
          <QuerySelect
            query={VARIANT_COLORS}
            label="Variant Color"
            {...form.getInputProps('color')}
            placeholder="Color"
          />
          <DateInput
            required
            label="Quoted On"
            description="Date at which the price was quoted"
            {...form.getInputProps('quotedAt')}
            placeholder="Quoted At"
          />
          <TextInput
            label="Dealership Name"
            description="This will help us identity any patterns in the pricing"
            {...form.getInputProps('dealership')}
            placeholder="Dealership"
          />
          <TextInput
            label="Remark"
            description="Share your experience regarding the purchase"
            {...form.getInputProps('remark')}
            placeholder="Remark"
          />
          <CitySelector
            required
            description="This is used to show only the relevant prices to other users"
            {...form.getInputProps('city')}
          />
          <Button color="purple" loading={fetching} type="submit" fullWidth mt="md">
            Continue To Add Pricing
          </Button>
        </Stack>
      </form>
    </UserOnboardWrapper>
  );
};

export default AddUpdateContribution;
