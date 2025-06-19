import { chakra, Box, Flex, Collapse, Icon, SimpleGrid } from '@chakra-ui/react';
import { Section, SectionProps, SectionTitle } from '#components/home-page/section';
import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface FaqProps extends Omit<SectionProps, 'title' | 'children'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  items: { q: React.ReactNode; a: React.ReactNode }[];
}

export const Faq: React.FC<FaqProps> = (props) => {
  const {
    title = 'Frequently asked questions',
    description,
    items = [],
  } = props;

  return (
    <Section id="faq">
      <SectionTitle title={title} description={description} />

      <Box flex={1} flexDirection={"column"}>
        {items?.map(({ q, a }, i) => {
          return <FaqItem key={i} question={q} answer={a} />;
        })}
      </Box>
    </Section>
  );
};

export interface FaqItemProps {
  question: React.ReactNode;
  answer: React.ReactNode;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Box
      borderColor="gray.200"
      borderRadius="md"
      p={4}
      bg={isOpen ? 'gray.700' : 'gray.800'}
      color="white"
      _hover={{ cursor: 'pointer', bg: 'gray.700' }}
      onClick={toggle}
    >
      <Flex justify="space-between" align="center">
        <chakra.dt fontWeight="semibold" fontSize="lg">
          {question}
        </chakra.dt>
        <Icon as={isOpen ? FiChevronUp : FiChevronDown} boxSize={5} />
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <chakra.dd mt={4} fontSize="md" color="gray.300">
          {answer}
        </chakra.dd>
      </Collapse>
    </Box>
  );
};