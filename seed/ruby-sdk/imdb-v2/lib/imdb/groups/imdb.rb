# frozen_string_literal: true

module IMDB
  module Groups
    class IMDB < Common::Group
      def get_movie(movie_id:)
        movie_id = Types::MovieID.parse(movie_id)

        response = @client.get(path: "movies/#{movie_id}")

        case response.status
        when 200
          Types::Movie.from_hash(response.body)
        when 404
          raise Errors::MovieDoesNotExistError
        end
      end

      def create_movie(request:)
        @client.post(path: "movies/create-movie", params: request.to_json)
      end
    end
  end
end
