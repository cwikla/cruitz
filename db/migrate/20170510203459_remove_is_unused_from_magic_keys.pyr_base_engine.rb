# This migration comes from pyr_base_engine (originally 20151007180602)
class RemoveIsUnusedFromMagicKeys < ActiveRecord::Migration[5.1]
  def up
    remove_column :pyr_base_magic_keys, :is_unused
  end

  def down
    add_column :pyr_base_magic_keys, :is_unused, :boolean, :default => true
  end
end
