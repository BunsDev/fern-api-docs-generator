# frozen_string_literal: true

require "dry/types"
require "dry/struct"

module IMDB
  module Common
    module Types
      include Dry.Types()

      class Struct < Dry::Struct
        def to_json(*_args)
          JSON.dump(to_h)
        end
      end
    end
  end
end
