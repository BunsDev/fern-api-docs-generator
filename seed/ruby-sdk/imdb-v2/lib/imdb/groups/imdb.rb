# frozen_string_literal: true

module IMDB
  module Groups
    class IMDB < Common::Group
      # @param movie_id [String]
      # @return [IMDB::Types::Movie]
      def get_movie(movie_id:)
        movie_id = Types::MovieID.call(movie_id)

        response = @client.get(path: "movies/#{movie_id}")

        case response.status
        when 200
          Types::Movie.call(response.body)
        when 404
          raise Errors::MovieDoesNotExistError
        end
      end

      # @param request [IMDB::Types::CreateMovieRequest]
      # @return [String]
      def create_movie(request:)
        Types::MovieID.call(
          @client.post(path: "movies/create-movie", params: request.to_json)
        )
      end
    end
  end
end
