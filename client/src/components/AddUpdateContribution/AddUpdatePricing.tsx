import { useAuth } from '@/authentication/AuthContext';
import {
  Add_Update_ContributionMutation,
  Contribution_Price_Items_Constraint,
  Contribution_Price_Items_Update_Column,
  Contributions_Constraint,
  Contributions_Update_Column,
  Order_By,
  Price_ItemsQuery,
} from '@/gql/graphql';
import { REFRESH_TOKEN } from '@/graphql/auth.gql';
import { ADD_UPDATE_CONTRIBUTION, PRICE_ITEMS } from '@/graphql/contribution.gql';
import convertToInr from '@/utils/convertToInr';
import { setAccessToken } from '@/utils/tokens';
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
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconMinus, IconPlus, IconTrash } from '@tabler/icons-react';
import { useEffect } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import { useClient, useMutation, useQuery } from 'urql';
import UserOnboardWrapper from '../UserOnboard/UserOnboardWrapper';
import { useNavigate } from 'react-router-dom';
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

const AddUpdatePricing = ({ contribution }: AddUpdatePricingType) => {
  const client = useClient();
  const navigate = useNavigate();
  const { refreshClient } = useAuth();
  const form = useForm<FormState>({
    initialValues: {
      total: contribution?.total || 0,
      priceBreakup:
        contribution?.items?.map((item) => ({
          id: item?.id,
          item: item?.price_item,
          value: item?.value,
        })) || [],
    },
    validate: {},
  });
  const [{ fetching, data: pData }, addUpdateContribution] = useMutation(ADD_UPDATE_CONTRIBUTION);
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

  return (
    <>
      {pData?.insert_contributions_one?.items?.length && (
        <ConfettiExplosion
          onComplete={async () => {
            const { data } = await client.mutation(REFRESH_TOKEN, {
              refreshToken: localStorage.getItem('refreshToken'),
            });
            const newAccessToken = data?.refreshToken?.data;
            if (newAccessToken) {
              // Update our local variables and write to our storage
              setAccessToken(newAccessToken);
              refreshClient();
            }

            modals.closeAll();
            navigate('/', { replace: true });
          }}
          width={1200}
          force={0.6}
          duration={2500}
          zIndex={999}
        />
      )}
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
                title: 'Your Contribution has been added',
                message: 'Thank you for helping people make smarter decisions! 🧠💡',
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
    </>
  );
};

export default AddUpdatePricing;
