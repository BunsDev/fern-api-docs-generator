# frozen_string_literal: true

module Imdb
  module Framework
    module Types
      # Module for defining enums
      module Enum
        include Type

        # @return [Array<Object>]
        def values
          @values ||= constants.map { |c| const_get(c) }
        end

        # @api private
        def finalize!
          values
        end
      end
    end
  end
end
