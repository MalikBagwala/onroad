import { REGISTER } from '@/graphql/auth.gql';
import { VARIANT_COLORS } from '@/graphql/variant.gql';
import { Alert, Button, Stack, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconDatabase } from '@tabler/icons-react';
import { useMutation } from 'urql';
import CitySelector from '../NewUser/CitySelector';
import QuerySelect from '../QuerySelect/QuerySelect';
import UserOnboardWrapper from '../UserOnboard/UserOnboardWrapper';
import VariantSelector from '../VariantSelector/VariantSelector';
import { ADD_UPDATE_CONTRIBUTION } from '@/graphql/contribution.gql';
import { notifications } from '@mantine/notifications';
import { Contributions_Constraint, Contributions_Update_Column } from '@/gql/graphql';

type AddUpdateContributionType = {};
const AddUpdateContribution = ({}: AddUpdateContributionType) => {
  const form = useForm({
    initialValues: {
      variant: null,
      color: null,
      city: null,
      quotedAt: new Date(),
      dealership: null,
      remark: null,
      priceBreakup: [],
    },
    validate: {},
  });
  const [{ fetching }, addUpdateContribution] = useMutation(ADD_UPDATE_CONTRIBUTION);

  console.log(form.values);
  return (
    <UserOnboardWrapper
      title={'Your anonymous contribution will help people make smarter decisions! 🧠💡'}
    >
      <form
        onSubmit={form.onSubmit(async (values) => {
          const { data } = await addUpdateContribution({
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
            notifications.show({
              title: 'Contribution Added',
              message: 'Thank you for your contribution',
              color: 'green',
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
            Contribute
          </Button>
        </Stack>
      </form>
    </UserOnboardWrapper>
  );
};

export default AddUpdateContribution;
