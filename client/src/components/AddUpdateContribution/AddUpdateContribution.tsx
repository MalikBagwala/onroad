import { REGISTER } from '@/graphql/auth.gql';
import { Alert, Button, Select, Stack, Text, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconDatabase } from '@tabler/icons-react';
import { useMutation } from 'urql';
import CitySelector from '../NewUser/CitySelector';
import UserOnboardWrapper from '../UserOnboard/UserOnboardWrapper';
import VariantSelector from '../VariantSelector/VariantSelector';

type AddUpdateContributionType = {};
const AddUpdateContribution = ({}: AddUpdateContributionType) => {
  const [visible, { toggle }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      variant: null,
      color: null,
      city: null,
      quotedAt: null,
      dealership: null,
      remark: null,
      priceBreakup: [],
    },
    validate: {},
  });
  const [{ fetching }, register] = useMutation(REGISTER);

  return (
    <UserOnboardWrapper
      title={'Your anonymous contribution will help people make smarter decisions! 🧠💡'}
    >
      <form onSubmit={form.onSubmit(async (values) => {})}>
        <Stack mt={'xs'}>
          <Alert p={'xs'} variant="light" color="blue" icon={<IconDatabase />}>
            This contribution is completely anomyous, we will <strong>NEVER</strong> share your
            personal information with anyone
          </Alert>
          <VariantSelector
            {...form.getInputProps('variant')}
            label="Vehicle Variant"
            placeholder="Variant"
          />
          <Select label="Variant Color" {...form.getInputProps('color')} placeholder="Color" />
          <DateInput
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
