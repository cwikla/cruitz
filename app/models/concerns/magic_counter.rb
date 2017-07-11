module MagicCounter
  extend ActiveSupport::Concern

  included do
    before_create :magic_counter_create
  end

  module ClassMethods
    acts_as_magic_counter(*cols)
      cattr_accessor :magic_counter_cols
      self.magic_counter_cols = []
    end
  end

  def magic_counter_create
    begin
      self.transaction(:requires_new => true) do
        map = Hash[self.class.magic_counter_cols.map {|acol| [acol, self.send(acol)] }
        counter = self.class.where(map).maximum(:magic_counter)
        self.magic_counter = counter
      end
    rescue ActiveRecord::RecordNotUnique, ActiveRecord::StatementInvalid => rnu
    end
  end
end
