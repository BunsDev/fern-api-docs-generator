# frozen_string_literal: true

module IMDB
  module Common
    class Type
      def self.parse(_input)
        raise NotImplementedError
      end

      def self.literal_class
        raise NotImplementedError
      end

      # returns literal_class
      def serialize
        raise NotImplementedError
      end
    end
  end
end
