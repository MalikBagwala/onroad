import {
  Add_Update_ContributionMutation,
  Contribution_Price_Items_Constraint,
  Contribution_Price_Items_Update_Column,
  Contributions_Constraint,
  Contributions_Update_Column,
  Order_By,
  Price_ItemsQuery,
} from '@/gql/graphql';
import { ADD_UPDATE_CONTRIBUTION, PRICE_ITEMS } from '@/graphql/contribution.gql';
import convertToInr from '@/utils/convertToInr';
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  NumberInput,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconMinus, IconPlus, IconTrash } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useMutation, useQuery } from 'urql';
import UserOnboardWrapper from '../UserOnboard/UserOnboardWrapper';
type AddUpdatePricingType = {
  contribution: Add_Update_ContributionMutation['insert_contributions_one'];
};

type FormState = {
  total: number;
  priceBreakup: {
    id?: string;
    item: Price_ItemsQuery['price_items'][0];
    value: number | undefined;
  }[];
};

const INITIAL_STATE: FormState = {
  total: 94844.99,
  priceBreakup: [
    {
      item: {
        id: 'd4b67ec9-c2c9-4f6b-964e-f03e389c8c2f',
        name: 'Ex-Showroom',
        type: 'DB',
        __typename: 'price_items',
      },
      value: 108344.99,
    },
    {
      item: {
        id: 'bee9b5c2-6e97-494d-9cd9-140380c78c16',
        name: 'Road Tax',
        type: 'DB',
        __typename: 'price_items',
      },
      value: 0,
    },
    {
      item: {
        id: '9edf5329-d563-49ae-b1b7-f18e6bfbc15d',
        name: 'Insurance',
        type: 'DB',
        __typename: 'price_items',
      },
      value: 2500,
    },
    {
      item: {
        id: '60ea232c-467d-451c-ba35-c7b5b4e438da',
        name: 'RTO',
        type: 'DB',
        __typename: 'price_items',
      },
      value: 1500,
    },
    {
      item: {
        id: '8ae525cc-9b34-42a5-b33b-c8cd2caba1f1',
        name: 'Accessories',
        type: 'DB',
        __typename: 'price_items',
      },
      value: 4000,
    },
    {
      item: {
        id: '60aabb24-f95d-47eb-9b5b-fa53794415ab',
        name: 'Misc',
        type: 'DB',
        __typename: 'price_items',
      },
      value: 7000,
    },
    {
      item: {
        id: 'a94cde51-511e-414b-8c2b-afb4e1cc9a40',
        name: 'FAME II Subsidy',
        type: 'CR',
        __typename: 'price_items',
      },
      value: 28500,
    },
    {
      item: {
        id: '523ade17-98eb-43f8-8040-608b60324f4b',
        name: 'State Subsidy',
        type: 'CR',
        __typename: 'price_items',
      },
      value: 0,
    },
    {
      item: {
        id: 'a832dd83-3ec5-47ed-946a-06d7905a07cd',
        name: 'Discount',
        type: 'CR',
        __typename: 'price_items',
      },
      value: 0,
    },
  ],
};
const AddUpdatePricing = ({ contribution }: AddUpdatePricingType) => {
  const form = useForm<FormState>({
    // initialValues: {
    //   total: 0,
    //   priceBreakup: [],
    // },
    initialValues: INITIAL_STATE,
    validate: {},
  });
  const [{ fetching }, addUpdateContribution] = useMutation(ADD_UPDATE_CONTRIBUTION);
  const [{ data }] = useQuery({
    query: PRICE_ITEMS,
    variables: {
      order_by: {
        serial_no: Order_By.AscNullsLast,
      },
    },
  });
  const priceItemMap = data?.price_items?.map((item) => ({
    value: item?.id,
    label: item.name,
    disabled: form.values?.priceBreakup?.find((priceItem) => priceItem.item.id === item.id),
    type: item.type,
  }));
  useEffect(() => {
    if (!form?.values?.priceBreakup?.length && data?.price_items?.length) {
      form.setFieldValue(
        'priceBreakup',
        data.price_items.map((item) => ({ item, value: undefined }))
      );
    }
  }, [data]);

  console.log(form.values);
  return (
    <UserOnboardWrapper title={'Add List of all the pricings here'}>
      <form
        onSubmit={form.onSubmit(async (values) => {
          const { data, error } = await addUpdateContribution({
            object: {
              id: contribution?.id,
              quoted_on: contribution?.quoted_on,
              dealership_name: contribution?.dealership_name,
              city_id: contribution?.city?.id,
              variant_id: contribution?.variant?.id,
              //   quoted_on: contribution?.,

              items: {
                data: values.priceBreakup.map((item, index) => ({
                  id: item.id,
                  price_item_id: item.item.id,
                  value: item.value,
                  serial_no: index + 1,
                })),
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
              update_columns: [Contributions_Update_Column.VariantId],
              //   update_columns: [],
            },
          });
          if (error || !data?.insert_contributions_one) {
            notifications.show({
              title: 'Error',
              message: 'Something went wrong',
              color: 'red',
            });
          } else {
            notifications.show({
              title: 'Success',
              message: 'Your contribution has been added',
              color: 'green',
            });
          }
        })}
      >
        <Stack mt={'xs'}>
          <Button
            disabled={form.values?.priceBreakup?.length >= (data?.price_items?.length as any)}
            onClick={() => {
              if (!data) return;
              const valuesClone = structuredClone(form.values);
              valuesClone.priceBreakup.push({ item: null as any, value: 0 });
              form.setValues(valuesClone);
            }}
            variant="subtle"
          >
            Add Price Item
          </Button>
          {form?.values?.priceBreakup?.map(({ item, value }, index) => {
            const isCredit = item?.type === 'CR';
            return (
              <Flex key={item?.id} align={'center'} gap={'xs'} justify={'space-between'}>
                <Flex w={'100%'}>
                  <Select
                    value={item?.id}
                    data={(priceItemMap as any) || []}
                    onChange={(value) => {
                      const valuesClone = structuredClone(form.values);
                      if (valuesClone.priceBreakup?.[index] && data) {
                        valuesClone.priceBreakup[index].item =
                          data?.price_items.find((item) => item?.id === value) ||
                          data?.price_items[0];
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
                        valuesClone.total = valuesClone.priceBreakup.reduce((acc, curr) => {
                          if (curr.item?.type === 'CR') {
                            return acc - (curr.value || 0);
                          } else {
                            return acc + (curr.value || 0);
                          }
                        }, 0);
                      }
                      form.setValues(valuesClone);
                    }}
                  />
                  <ActionIcon
                    onClick={async () => {
                      const valuesClone = structuredClone(form.values);
                      if (valuesClone.priceBreakup?.[index]) {
                        valuesClone.priceBreakup.splice(index, 1);
                        valuesClone.total = valuesClone.priceBreakup.reduce((acc, curr) => {
                          if (curr.item?.type === 'CR') {
                            return acc - (curr.value || 0);
                          } else {
                            return acc + (curr.value || 0);
                          }
                        }, 0);
                      }
                      form.setValues(valuesClone);
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
      </form>
    </UserOnboardWrapper>
  );
};

export default AddUpdatePricing;
