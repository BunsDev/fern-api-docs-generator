# frozen_string_literal: true

module IMDB
  module Resources
    class Movie < IMDB::Common::Resource
      field :title, type: :string
      field :synopsis, type: :string
    end
  end
end
