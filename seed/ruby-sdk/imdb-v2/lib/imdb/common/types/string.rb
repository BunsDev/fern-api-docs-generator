# frozen_string_literal: true

module IMDB
  module Common
    module Types
      class String
        def initialize(format: nil, min_length: nil, max_length: nil)
          @format = format
          @min_length = min_length
          @max_length = max_length
        end

        def self.parse(value)
          value
        end

        def self.literal_class
          ::String
        end
      end
    end
  end
end
