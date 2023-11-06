import React, { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Button,
  Flex,
} from '@chakra-ui/react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import {
  BOOKS_QUERY,
  CREATE_BOOK_MUTATION,
  DELETE_BOOK_MUTATION,
  UPDATE_BOOK_MUTATION,
} from '../common/graphql';
import { useToast } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';

interface Book {
  id: number;
  name: string;
  description: string;
}

export const BookList: React.FC = () => {
  const client = useApolloClient();
  const toast = useToast();
  type ToastStatus = 'success' | 'error';

  const {
    isAuthenticated,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();
  const [getBooks, setGetBooks] = useState<Book[]>([]);
  const [newBookName, setNewBookName] = useState<string>('');
  const [newBookDescription, setNewBookDescription] = useState<string>('');
  const [newId, setNewId] = useState<number>(0);
  const [newName, setNewName] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');

  const [isOpen, setIsOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState({
    id: newId,
    name: '',
    description: '',
  });


  const onClose = () => {
    setIsOpen(false);
  };

  const { data } = useQuery<{ getBooks: Book[] }>(BOOKS_QUERY, {
    context: async ({ headers }: { headers: Record<string, string> }) => {
      try {
        const token = await getAccessTokenSilently();
        if (token) {
          headers = {
            ...headers,
            Authorization: `Bearer ${token}`,
          };
        } else {
          throw new Error('Unable to get ID token.');
        }
      } catch (error) {
        const errorMessage = (error as Error).message;
        toast({
          title: 'Error with authentication',
          description: errorMessage,
          status: 'error' as ToastStatus,
          duration: 3000,
          isClosable: true,
        });
      }
      return {
        headers,
      };
    },
  });

  useEffect(() => {
    if (data && data.getBooks) {
      setGetBooks(data.getBooks);
    }
  }, [data]);

  const getTokenAndCallMutation = async (mutation: any) => {
    try {
      const token = await getAccessTokenSilently();
      if (token) {
        await mutation({
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });
      } else {
        throw new Error('Unable to get ID token.');
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      toast({
        title: 'Error with authentication',
        description: errorMessage,
        status: 'error' as ToastStatus,
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const [createBook] = useMutation(CREATE_BOOK_MUTATION);
  const [removeBook] = useMutation(DELETE_BOOK_MUTATION);
  const [updateBook] = useMutation(UPDATE_BOOK_MUTATION);

  const handleEditClick = (book: Book) => {
    setNewId(book.id);
    setNewName(book.name);
    setNewDescription(book.description);
    setSelectedBook(book);
    setIsOpen(true);
  };

  const handleAddBook = async () => {
    await getTokenAndCallMutation(async () => {
      try {
        const result = await createBook({
          variables: {
            name: newBookName,
            description: newBookDescription,
          },
        });

        if (result.data && result.data.createBook) {
          const newBook = result.data.createBook;
          toast({
            title: 'Book created successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });

          setGetBooks((prevBooks) => [...prevBooks, newBook]);

          setNewBookName('');
          setNewBookDescription('');
        } else {
          toast({
            title: 'Failed to create the book',
            status: 'error' as ToastStatus,
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        const errorMessage = (error as Error).message;
        toast({
          title: 'Error creating the book',
          description: errorMessage,
          status: 'error' as ToastStatus,
          duration: 3000,
          isClosable: true,
        });
      }
    });
  };

  const handleDeleteBook = async (id: number) => {
    await getTokenAndCallMutation(async () => {
      try {
        const result = await removeBook({
          variables: {
            id: id,
          },
        });

        if (result.data && result.data.removeBook) {
          toast({
            title: 'Book deleted successfully',
            status: 'success' as ToastStatus,
            duration: 3000,
            isClosable: true,
          });
          client.query({
            query: BOOKS_QUERY,
          });
        } else {
          toast({
            title: 'Failed to delete the book',
            status: 'error' as ToastStatus,
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        const errorMessage = (error as Error).message;
        toast({
          title: 'Error deleting the book',
          description: errorMessage,
          status: 'error' as ToastStatus,
          duration: 3000,
          isClosable: true,
        });
      }
    });
  };

  const handleUpdateBook = async (
    id: number,
    name: string,
    description: string
  ) => {
    await getTokenAndCallMutation(async () => {
      try {
        const result = await updateBook({
          variables: {
            id: id,
            name: name,
            description: description,
          },
        });
        if (result.data && result.data.updateBook) {
          toast({
            title: 'Book updated successfully',
            status: 'success' as ToastStatus,
            duration: 3000,
            isClosable: true,
          });
          setIsOpen(false);
        } else {
          toast({
            title: 'Failed to update the book',
            status: 'error' as ToastStatus,
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        const errorMessage = (error as Error).message;
        toast({
          title: 'Error updating the book',
          description: errorMessage,
          status: 'error' as ToastStatus,
          duration: 3000,
          isClosable: true,
        });

      }
    });
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <Flex justifyContent={'space-between'}>
            Hello, {user && user.name}
            <Button
              backgroundColor={'green.900'}
              color={'#fff'}
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Log out
            </Button>
          </Flex>
          <Input
            value={newBookName}
            onChange={(e) => setNewBookName(e.target.value)}
            placeholder="New Book Name"
          />
          <Input
            value={newBookDescription}
            onChange={(e) => setNewBookDescription(e.target.value)}
            placeholder="New Book Description"
          />
          <Button
            onClick={handleAddBook}
            backgroundColor={'green.900'}
            color={'#fff'}
          >
            Add Book
          </Button>
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {getBooks.map((book) => (
                <Tr key={book.id}>
                  <Td>{book.name}</Td>
                  <Td>{book.description}</Td>
                  <Td>
                    <Flex>
                      <Button
                        onClick={() => handleDeleteBook(book.id)}
                        backgroundColor={'red.700'}
                        color={'#fff'}
                      >
                        Delete
                      </Button>
                      <Button
                        onClick={() => handleEditClick(book)}
                        backgroundColor={'yellow.700'}
                        marginLeft={5}
                        color={'#fff'}
                      >
                        Update
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      ) : (
        <Button onClick={() => loginWithRedirect()}>
          Log in to access Scrapays book management
        </Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Book</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New Book Name"
            />
            <Input
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="New Book Description"
              marginTop={4}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              backgroundColor={'green.900'}
              color={'#fff'}
              onClick={() =>
                handleUpdateBook(selectedBook.id, newName, newDescription)
              }
            >
              Update
            </Button>
            <Button
              colorScheme="gray"
              onClick={onClose}
              backgroundColor={'red.700'}
              color={'#fff'}
              marginLeft={5}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
