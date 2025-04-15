# frozen_string_literal: true

module Imdb
  module Models
    class Movie < Framework::Types::Model
      field :name, String, required: true
      field :rating, Float
    end
  end
end
