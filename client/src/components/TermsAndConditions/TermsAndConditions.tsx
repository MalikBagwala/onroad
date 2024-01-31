import { Box, Container, List, Text, Title } from '@mantine/core';

const TermsAndConditions = () => {
  return (
    <Container size="sm">
      <Title order={2}>Terms and Conditions</Title>

      <Box>
        <Text>Welcome to onroad.one!</Text>

        <Text>
          These terms and conditions outline the rules and regulations for the use of onroad.one's
          Website, located at <Text c="purple">https://onroad.one</Text>.
        </Text>

        <Text>
          By accessing this website, we assume you accept these terms and conditions. Do not
          continue to use onroad.one if you do not agree to take all of the terms and conditions
          stated on this page.
        </Text>
      </Box>

      <Box>
        <Title order={3}>Cookies</Title>

        <Text>
          We employ the use of cookies. By accessing onroad.one, you agreed to use cookies in
          agreement with the onroad.one's Privacy Policy.
        </Text>

        <Text>
          Most interactive websites use cookies to let us retrieve the user's details for each
          visit. Cookies are used by our website to enable the functionality of certain areas to
          make it easier for people visiting our website. Some of our affiliate/advertising partners
          may also use cookies.
        </Text>
      </Box>

      <Box>
        <Title order={3}>License</Title>

        <Text>
          Unless otherwise stated, onroad.one and/or its licensors own the intellectual property
          rights for all material on onroad.one. All intellectual property rights are reserved. You
          may access this from onroad.one for your own personal use subjected to restrictions set in
          these terms and conditions.
        </Text>

        <List>
          <li>Republish material from onroad.one</li>
          <li>Sell, rent or sub-license material from onroad.one</li>
          <li>Reproduce, duplicate or copy material from onroad.one</li>
          <li>Redistribute content from onroad.one</li>
        </List>

        <Text>
          This Agreement shall begin on the date hereof. Our Terms and Conditions were created with
          the help of the{' '}
          <a href="https://www.termsandconditionsgenerator.com/">
            Free Terms and Conditions Generator
          </a>
          .
        </Text>
      </Box>

      <Box>
        <Text>
          Parts of this website offer an opportunity for users to post and exchange opinions and
          information in certain areas of the website. onroad.one does not filter, edit, publish or
          review Comments prior to their presence on the website. Comments do not reflect the views
          and opinions of onroad.one, its agents and/or affiliates. Comments reflect the views and
          opinions of the person who post their views and opinions. To the extent permitted by
          applicable laws, onroad.one shall not be liable for the Comments or for any liability,
          damages or expenses caused and/or suffered as a result of any use of and/or posting of
          and/or appearance of the Comments on this website.
        </Text>

        {/* ... (Continue with the rest of the content using Mantine components) */}
      </Box>

      <Box>
        <Title order={3}>Hyperlinking to our Content</Title>

        <Text>
          The following organizations may link to our Website without prior written approval:
        </Text>

        <List>
          <li>Government agencies;</li>
          <li>Search engines;</li>
          <li>News organizations;</li>
          <li>
            Online directory distributors may link to our Website in the same manner as they
            hyperlink to the Websites of other listed businesses; and
          </li>
          <li>
            System-wide Accredited Businesses except soliciting non-profit organizations, charity
            shopping malls, and charity fundraising groups which may not hyperlink to our Web site.
          </li>
        </List>

        <Text>
          These organizations may link to our home page, to publications or to other Website
          information so long as the link: (a) is not in any way deceptive; (b) does not falsely
          imply sponsorship, endorsement or approval of the linking party and its products and/or
          services; and (c) fits within the context of the linking party's site.
        </Text>

        {/* ... (Continue with the rest of the content using Mantine components) */}
      </Box>

      {/* ... (Continue with the rest of the content using Mantine components) */}
    </Container>
  );
};

export default TermsAndConditions;
