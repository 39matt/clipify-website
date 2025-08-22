import { Text, useClipboard, useToast } from '@chakra-ui/react'

interface CopyableTextProps {
  value: string;
}

const CopyableText: React.FC<CopyableTextProps> = ({ value }) => {
  const { onCopy } = useClipboard(value);
  const toast = useToast();

  const handleCopy = () => {
    onCopy();
    toast({
      title: "Copied to clipboard",
      description: value,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Text
      cursor="pointer"
      onClick={handleCopy}
      _hover={{ textDecoration: "underline" }}
      color="white"
      fontSize="sm"
      isTruncated
      w="full"
    >
      {value}
    </Text>
  );
};
export default CopyableText;