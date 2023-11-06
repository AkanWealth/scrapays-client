import { gql } from '@apollo/client';


export const BOOKS_QUERY = gql`
  query {
    getBooks {
      id
      name
      description
    }
  }
`;

export const CREATE_BOOK_MUTATION = gql`
  mutation createBook($name: String!, $description: String!) {
    createBook(name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

export const DELETE_BOOK_MUTATION = gql`
  mutation removeBook($id: Float!) {
    removeBook(id: $id) {
      id
    }
  }
`;

export const UPDATE_BOOK_MUTATION = gql`
  mutation updateBook($id: Float!, $name: String!, $description: String!) {
    updateBook(id: $id, name: $name, description: $description) {
      id
      name
      description
    }
  }
`;
