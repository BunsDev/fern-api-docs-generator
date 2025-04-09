# frozen_string_literal: true

module IMDB
  module Types
    class CreateMovieRequest < IMDB::Common::Types::Struct
      attribute :title, IMDB::Common::Types::String
      attribute :rating, IMDB::Common::Types::Float
    end
  end
end
