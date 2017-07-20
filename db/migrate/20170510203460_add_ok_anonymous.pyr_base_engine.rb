# This migration comes from pyr_base_engine (originally 20161007211725)
class AddOkAnonymous < ActiveRecord::Migration[5.1]
  def change
		add_column :users, :anon, :boolean, :null => false, :default => true
  end
end
