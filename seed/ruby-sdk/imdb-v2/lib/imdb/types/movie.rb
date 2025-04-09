# frozen_string_literal: true

module IMDB
  module Types
    class Movie < IMDB::Common::Types::Object
      field :title, type: :string
      field :synopsis, type: :string
    end
  end
end
