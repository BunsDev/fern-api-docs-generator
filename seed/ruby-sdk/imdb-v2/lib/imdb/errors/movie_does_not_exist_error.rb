# frozen_string_literal: true

module IMDB
  module Errors
    class MovieDoesNotExistError < IMDB::Error
      def initialize(status_code: 404, type: :movie_id)
      end
    end
  end
end
