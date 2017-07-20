# This migration comes from pyr_base_engine (originally 20151007174829)
class AddIssuedAtToMagicKeys < ActiveRecord::Migration[5.1]
  def up
    add_column :pyr_base_magic_keys, :issued_at, :timestamp

    Pyr::Base::MagicKey.reset_column_information

    Pyr::Base::MagicKey.update_all("issued_at = created_at")
  end

  def down
    remove_column :pyr_base_magic_keys, :issued_at
  end
end

