import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  CardProps,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link } from "@saas-ui/react";
import { FaTwitter } from "react-icons/fa";
import { MotionBox } from '#components/home-page/motion/box'

export interface TestimonialProps extends CardProps {
  name: string;
  description: React.ReactNode;
  avatar: string;
  href?: string;
  children?: React.ReactNode;
  delay: number;
}

export const Testimonial = ({
  name,
  description,
  avatar,
  href,
  children,
  delay,
  ...rest
}: TestimonialProps) => {
  return (
    <MotionBox
      initial={{ scale: 1, opacity: 0, translateY: '20px' }}
      whileInView={{ scale: 1, opacity: 1, translateY: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        type: 'tween',
        ease: 'easeOut',
        duration: 0.6,
        delay,
      }}
    >
    <Card position="relative" {...rest}>
      <CardHeader display="flex" flexDirection="row" alignItems="center">
        <Avatar name={name} src={avatar} size="sm" bg="transparent" />
        <Stack spacing="1" ms="4">
          <Heading size="sm">{name}</Heading>
          <Text color="muted" size="xs">
            {description}
          </Text>
        </Stack>
      </CardHeader>
      <CardBody>
        {children}

        {href && (
          <Link href={href} position="absolute" top="4" right="4">
            <FaTwitter />
          </Link>
        )}
      </CardBody>
    </Card>
    </MotionBox>
  );
};
