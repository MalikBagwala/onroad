import { useAuth, useCurrentUser } from '@/authentication/AuthContext';
import {
  Contribution_Price_Items_Constraint,
  Contribution_Price_Items_Update_Column,
  Contributions_Constraint,
  Contributions_Update_Column,
  Order_By,
} from '@/gql/graphql';
import { ADD_UPDATE_CONTRIBUTION, CONTRIBUTIONS, PRICE_ITEMS } from '@/graphql/contribution.gql';
import { VARIANT_COLORS } from '@/graphql/variant.gql';
import {
  Alert,
  Box,
  Button,
  Divider,
  Flex,
  Stack,
  TextInput,
  Text,
  Select,
  ActionIcon,
  NumberInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconDatabase, IconMinus, IconPlus, IconTrash } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClient, useMutation, useQuery } from 'urql';
import CitySelector from '../NewUser/CitySelector';
import QuerySelect from '../QuerySelect/QuerySelect';
import VariantSelector from '../VariantSelector/VariantSelector';
import { REFRESH_TOKEN } from '@/graphql/auth.gql';
import { setAccessToken } from '@/utils/tokens';
import { modals } from '@mantine/modals';
import ConfettiExplosion from 'react-confetti-explosion';
import convertToInr from '@/utils/convertToInr';
import debounce from '@/utils/debounce';

type AddUpdateContributionType = {};

const AddUpdateContribution = ({}: AddUpdateContributionType) => {
  const { id } = useParams();
  const client = useClient();
  const { data: uData } = useCurrentUser();
  const { refreshClient } = useAuth();
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      id: 'new',
      variant: null,
      color: null,
      city: uData?.city?.id,
      quotedAt: new Date(),
      dealership: '',
      remark: '',
      total: 0,
      priceBreakup: [] as any[],
    },
    validate: {},
  });
  const [{ data: pData }] = useQuery({
    query: PRICE_ITEMS,
    variables: {
      order_by: {
        serial_no: Order_By.AscNullsLast,
      },
    },
  });

  const priceItemMap = pData?.price_items?.map((item) => ({
    value: item?.id,
    label: item.name,
    disabled: form.values?.priceBreakup?.find((priceItem) => priceItem.item?.id === item.id),
    type: item.type,
  }));

  useEffect(() => {
    if (!form?.values?.priceBreakup?.length && pData?.price_items?.length) {
      form.setFieldValue(
        'priceBreakup',
        pData.price_items.map((item) => ({ item, value: undefined }))
      );
    }
  }, [pData]);
  const calculateTotal = useMemo(
    () =>
      debounce((values) => {
        const valuesClone = structuredClone(values);
        valuesClone.total = valuesClone.priceBreakup.reduce((acc: any, curr: any) => {
          if (curr.item?.type === 'CR') {
            return acc - (curr.value || 0);
          } else {
            return acc + (curr.value || 0);
          }
        }, 0);
        form.setValues(valuesClone);
      }, 0),
    []
  );
  useEffect(() => {
    if (id !== 'new') {
      client
        .query(CONTRIBUTIONS, {
          where: {
            id: {
              _eq: id,
            },
          },
        })
        .then((data) => {
          const contribution = data.data?.contributions?.[0];
          if (!contribution) return;
          form.setValues({
            id: contribution.id,
            variant: contribution.variant.id,
            color: contribution.variant_color?.id,
            city: contribution.city?.id,
            quotedAt: new Date(contribution.quoted_on),
            dealership: contribution.dealership_name,
            remark: contribution.remark || '',
            total: contribution.total,
            priceBreakup:
              contribution?.items?.map((item) => ({
                id: item?.id,
                item: item?.price_item,
                value: item?.value,
              })) || [],
          });
        });
    }
  }, [id]);

  const [{ fetching, data }, addUpdateContribution] = useMutation(ADD_UPDATE_CONTRIBUTION);

  const handleSubmit = form.onSubmit(async (values) => {
    const { data, error } = await addUpdateContribution({
      object: {
        id: values.id === 'new' ? undefined : values.id,
        variant_id: values.variant,
        color_id: values.color,
        city_id: values.city,
        quoted_on: values.quotedAt?.toISOString()?.split('T')[0],
        dealership_name: values.dealership,
        remark: values.remark,
        items: {
          data: values.priceBreakup
            .map((item, index) => ({
              id: item.id,
              price_item_id: item.item.id,
              value: item.value,
              serial_no: index + 1,
            }))
            ?.filter((i) => i.value),
          on_conflict: {
            constraint: Contribution_Price_Items_Constraint.ContributionPriceItemsPkey,
            update_columns: [
              Contribution_Price_Items_Update_Column.SerialNo,
              Contribution_Price_Items_Update_Column.PriceItemId,
              Contribution_Price_Items_Update_Column.Value,
            ],
          },
        },
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
        title: 'Your Contribution has been added',
        message: 'Thank you for helping people make smarter decisions! 🧠💡',
        color: 'green',
      });
      if (form.values.id !== 'new') {
        navigate('/', { replace: true });
        form.reset();
      }
      // setActiveStep(2);
    } else {
      notifications.show({
        title: 'Error',
        message: error?.message,
        color: 'red',
      });
    }
  });
  return (
    <Box>
      {data?.insert_contributions_one?.items?.length && form.values.id === 'new' && (
        <ConfettiExplosion
          onComplete={async () => {
            if (!uData?.has_contributed) {
              const { data } = await client.mutation(REFRESH_TOKEN, {
                refreshToken: localStorage.getItem('refreshToken'),
              });
              const newAccessToken = data?.refreshToken?.data;
              if (newAccessToken) {
                // Update our local variables and write to our storage
                setAccessToken(newAccessToken);
                refreshClient();
              }
            }
            navigate('/', { replace: true });
            form.reset();
          }}
          width={1200}
          force={0.6}
          duration={2500}
          zIndex={999}
        />
      )}
      <Stack mb={'sm'}>
        <Alert p={'xs'} variant="light" color="blue" icon={<IconDatabase />}>
          This contribution is anomyous, we will <strong>NEVER</strong> share your personal
          information with anyone
        </Alert>
      </Stack>
      <form onSubmit={handleSubmit}>
        <Flex>
          <Box w={'100%'}>
            <Stack mt={'xs'}>
              <VariantSelector
                required
                {...form.getInputProps('variant')}
                label="Vehicle Variant"
                placeholder="Variant"
              />
              <QuerySelect
                query={VARIANT_COLORS}
                variables={{
                  where: {
                    variant_id: {
                      _eq: form.values.variant,
                    },
                  },
                }}
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
            </Stack>
          </Box>
          <Divider mx={'md'} variant="dashed" labelPosition="center" orientation="vertical" />
          <Box w="100%">
            <Stack mt={'xs'}>
              <Button
                disabled={form.values?.priceBreakup?.length >= (pData?.price_items?.length as any)}
                onClick={() => {
                  if (!pData) return;
                  const valuesClone = structuredClone(form.values);
                  valuesClone.priceBreakup.push({ item: null as any, value: 0 });
                  form.setValues(valuesClone);
                }}
                leftSection={<IconPlus style={{ width: '70%', height: '70%' }} stroke={1.5} />}
                variant="outline"
              >
                Add Price Item
              </Button>
              {form?.values?.priceBreakup?.map(({ item, value }, index) => {
                const isCredit = item?.type === 'CR';
                return (
                  <Flex key={item?.id} align={'center'} gap={'xs'} justify={'space-between'}>
                    <Flex w={'100%'}>
                      <Select
                        placeholder="Select Type"
                        value={item?.id}
                        data={(priceItemMap as any) || []}
                        onChange={(value) => {
                          const valuesClone = structuredClone(form.values);
                          if (valuesClone.priceBreakup?.[index] && pData) {
                            valuesClone.priceBreakup[index].item =
                              pData?.price_items.find((item) => item?.id === value) ||
                              pData?.price_items[0];
                          }
                          form.setValues(valuesClone);
                        }}
                        rightSection={
                          isCredit ? (
                            <IconPlus
                              color="green"
                              style={{ width: '70%', height: '70%' }}
                              stroke={1.5}
                            />
                          ) : (
                            <IconMinus
                              color="red"
                              style={{ width: '70%', height: '70%' }}
                              stroke={1.5}
                            />
                          )
                        }
                      />
                    </Flex>
                    <Flex gap={'xs'} align={'center'}>
                      <NumberInput
                        miw={'12rem'}
                        autoFocus
                        min={0}
                        step={500}
                        decimalScale={2}
                        thousandSeparator=","
                        thousandsGroupStyle="lakh"
                        valueIsNumericString={true}
                        leftSection={
                          <Box c={isCredit ? 'green.8' : 'red.8'} display={'inline-block'}>
                            ₹
                          </Box>
                        }
                        value={value}
                        onChange={(value) => {
                          console.log(value);
                          const valuesClone = structuredClone(form.values);
                          if (valuesClone.priceBreakup?.[index]) {
                            valuesClone.priceBreakup[index].value = Number(value);
                            calculateTotal(valuesClone);
                          }
                        }}
                      />
                      <ActionIcon
                        onClick={async () => {
                          const valuesClone = structuredClone(form.values);
                          if (valuesClone.priceBreakup?.[index]) {
                            valuesClone.priceBreakup.splice(index, 1);
                            calculateTotal(valuesClone);
                          }
                        }}
                        color="red"
                        variant="light"
                        aria-label="Delete Price Item"
                      >
                        <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                      </ActionIcon>
                    </Flex>
                  </Flex>
                );
              })}
              <Divider />
              <Flex>
                <Text>Total</Text>
                <Text pr={'2.1rem'} ml="auto" fw="bold">
                  {convertToInr(form.values.total)}
                </Text>
              </Flex>
              <Button color="purple" loading={fetching} type="submit" fullWidth mt="md">
                Submit Contribution
              </Button>
            </Stack>
          </Box>
        </Flex>
      </form>
    </Box>
  );
};

export default AddUpdateContribution;
